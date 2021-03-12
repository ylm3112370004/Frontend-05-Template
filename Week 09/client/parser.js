// startTag  endTag  selfCloseTag

// 
const EOF = Symbol("eof");
let currentTextNode = null;
let currentToken = {
  type: "",
  tagName: "",
  // attr: value,
  // .....,
  // content: "c", 针对textNode
};
let currentAttribute = {
  name: "",
  value: "",
};
// type: "document" | "element" | "text"
/** stack中的元素
{
  type: "element" | "text",
  tagName: "",
  children: [],
  attributes: [
    {name: "", value},
    //.....
  ]
}
*/
let stack = [{ type: "document", children: [] }];

const emit = (token) => {
  let top = stack[stack.length-1];

  if (token.type === "startTag") {
    let element = {
      type: "element",
      tagName: token.tagName,
      children: [],
      attributes: []
    }
    for (let key in token) {
      if (key !== "type" && key !== "tagName") {
        element.attributes.push({
          name: key,
          value: token[key]
        });
      }
    }

    // 构建父子结构
    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) { // 如果不是自封闭标签，需要保存在stack中，与后序element对比
      stack.push(element);
    }

    currentTextNode = null;

  } else if (token.type === "endTag") {
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match");
    } else {
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === "text") {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token;
  } else {}
}

const data = (c) => {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {

  } else {
    emit({
      type: "text",
      content: c      // 组建树的时候再拼接
    })
    return data;
  }
}
const tagOpen = (c) => {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    }
    return tagName(c);
  } else {
    return;
  }
}
const endTagOpen = (c) => {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    }
    return tagName(c);
  } else if (c === ">") {
    // 报错
  } else {
    return;
  }
}
const tagName = (c) => {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return;
  }
}

const beforeAttributeName = (c) => {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/" || c === ">" | c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    // ??
  } else {
    return attributeName(c);
  }
}
const attributeName = (c) => {
  if (c.match(/^[a-zA-Z]$/)) {
    currentAttribute["name"] += c;
    return attributeName;
  } else if (c === "=") {
    return beforeAttributeValue;
  }
}

const beforeAttributeValue = (c) => {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeValue;
  } else if (c === "\"") {
    return doubleQuotedAttributeValue;
  } else if (c == "\'") {
    return singleQuotedAttributeValue;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    return unQuotedAttributeValue(c);
  }
}

const doubleQuotedAttributeValue = (c) => {
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

const singleQuotedAttributeValue = (c) => {
  if (c == "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
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

const unQuotedAttributeValue = (c) => {
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

const selfClosingStartTag = (c) => {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {

  }
}
const afterAttributeName = (c) => {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
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
module.exports.parseHTML = function (html) {
  console.log(html)
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  console.log(stack);
}