const EOF = Symbol("EOF");
const css = require('css');
const layout = require('./layout.js');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{ type: "document", children: [] }]; // document 初始根节点

let rules = []; // 保存收集到的规则
function addCSSRules(text) {
  var ast = css.parse(text);
  console.log(JSON.stringify(ast, null, ""));
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  // 去除文本选择器
  if (!selector || !element.attributes) return false;

  if (selector.charAt(0) === "#") { // id
    let attr = element.attributes.filter(attr => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") { // class
    let attr = element.attributes.filter(attr => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else { // tag
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function specificity(selector) {
  let p = [0, 0, 0, 0];
  let selectorParts = selector.split(" ");
  for (let part of selectorParts) {
    if (part.charAt(0) == "#") {
      p[1] += 1;
    } else if (part.charAt(0) == ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}

function computeCSS(element) {
  // reverse 标签匹配是当前元素逐级的往外匹配
  let elements = stack.slice().reverse();
  if (!element.computedStyle)
    element.computedStyle = {};

  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;
    let j = 1;  // 当前选择器的位置
    for (let i = 0; i < elements.length; i++) { // i 元素的位置
      if (j === selectorParts.length) break;
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      let sp = specificity(rule.selectors[0]);
      // 如果匹配到，要加入
      // console.log("ELement", element, "matched rule", rule);
      let computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {};   //方便存储value 以外的值
          }
          if (!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity =  sp;
          } else if(compare(computedStyle[declaration.property].specificity, sp) < 0) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity =  sp;
          }
        }
      }
      console.log(element.computedStyle);
    }

  }
}

function emit(token) {
  let top = stack[stack.length - 1];  // 栈顶

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: []
    };

    element.tagName = token.tagName;
    // 除 type、tagName外的所有token中的属性，添加到element.attributes中
    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }

    // 计算CSS的时机 在element 入栈前    
    computeCSS(element);

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw Error("Tag start end doesn't match!");
    } else {
      //++++++++++遇到style标签时，执行添加CSS规则的操作+++++++++++++++//
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content); // top.children[0].content 获取CSS文本节点
      }
      layout(top);
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
  } else if (c == "/") {
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
    emit(currentToken);
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
  // console.log(html)
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  console.log(stack[0]);
}