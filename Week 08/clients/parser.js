const EOF = Symbol("EOF");

function data(c) {
  if (c == "<") {
    return tagOpen;  // 不知道是三种的哪一种，标签开始 不是  开始标签
  } else if (c == EOF) {
    return;
  } else {
    return data;
  }
}

function tagOpen(c) {
  if (c == "/") {
    return endTagOpen; // 结束标签开始
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c); // reConsume;
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else if (c == ">") {
    // </>  是要报错的
  } else if (c == EOF) {
    // 是要报错的
  } else {

  }
}

function tagName(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    return tagName;
  } else if (c.match(/^[\t\n\f ]$/)) { // tab 换行 禁止 空格
    return beforeAttributeName;
  } else if (c == "/") { 
    return selfClosingStartTag;
  } else if (c == ">") {
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\n\t\f ]$/)) {
    return beforeAttributeName;
  } else if (c == ">") {
    return data;
  } else if (c == "=") {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
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

// 开始标签 <div
// 结束标签 </
// 自封闭标签 <img />
module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
}