const EOF = Symbol("EOF");
const css = require('css');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{type: "document", children:[]}]; // document 初始根节点

let rules = []; // 保存收集到的规则
function addCSSRules(text) {
  var ast = css.parse(text);
  console.log(JSON.stringify(ast, null, ""));
  rules.push(...ast.stylesheet.rules);
}

function emit(token) {
  let top = stack[stack.length-1];  // 栈顶

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: []
    };
    
    element.tagName = token.tagName;
    // 除 type、tagName外的所有token中的属性，添加到element.attributes中
    for (let p in token) {
      if (p != "type" && p != "tagName" && p != "isSelfClosing") {
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if(token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw Error("Tag start end doesn't match!");
    } else {
      //++++++++++遇到style标签时，执行添加CSS规则的操作+++++++++++++++//
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content); // top.children[0].content 获取CSS文本节点
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: ""
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c == "<") {
    return tagOpen;  // 不知道是三种的哪一种，标签开始 不是  开始标签
  } else if (c == EOF) {
    emit({
      type: "EOF"
    })
    return;
  } else { // 文本节点
    emit({
      type: "text",
      content: c      // 组建树的时候再拼接
    })
    return data;
  }
}

function tagOpen(c) {
  if (c == "/") {
    return endTagOpen; // 结束标签开始
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: ""
    }
    return tagName(c); // reConsume;
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: ""
    }
    return tagName(c); // reConsume;
  } else if (c == ">") {
    // </>  是要报错的
  } else if (c == EOF) {
    // 是要报错的
  } else {

  }
}

function tagName(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;  // 追加到tagName上
    return tagName;
  } else if (c.match(/^[\t\n\f ]$/)) { // tab 换行 禁止 空格
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\n\t\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    // error
    // return beforeAttributeName;
  } else {
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return afterAttributeName;
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == "\u0000") {

  } else if (c == "\"" || c == "'" || c == "<") {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue;
  } else if (c == "\"") {
    return doubleQuotedAttributeValue;
  } else if (c == "\'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {

  } else {
    return unQuotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c == "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if(c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {

  } else if (c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return unQuotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c == ">") {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c == EOF) {

  } else {

  }
}
function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(c);
  }
}

// 开始标签 <div
// 结束标签 </
// 自封闭标签 <img />
module.exports.parseHTML = function parseHTML(html) {
  console.log(html)
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  console.log(stack[0]);
}