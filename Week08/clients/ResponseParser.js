const TrunkedBodyParser = require('./TrunkedBodyParser');

// this.WAITING_STATUS_LINE = 0; // \r
// this.WAITING_STATUS_LINE_END = 1; // \n
// this.WAITING_HEADER_NAME = 2;
// this.WAITING_HEADER_SPACE = 3;
// this.WAITING_HEADER_VALUE = 4;
// this.WAITING_HEADER_LINE_END = 5;
// this.WAITING_HEADER_BLOCK_END = 6;
// this.WAITING_BODY = 7;

let statusLine = "";
let headers = {};
let headerName = "";
let headerValue = "";
let bodyParser = null;

function waitingStatusLine(char) {
  if (char === "\r") {
    return waitingStatusLineEnd;
  } else {
    statusLine += char;
    return waitingStatusLine;
  }
}

function waitingStatusLineEnd(char) {
  if (char === "\n") {
    return waitingHeadersName;
  } else {
    return waitingStatusLine(char);
  }
}

function waitingHeadersName(char) {
  if (char === ":") {
    return waitingHeadersSpace;
  } else {
    headerName += char;
    return waitingHeadersName;
  }
}

function waitingHeadersSpace(char) {
  if (char === " ") {
    return waitingHeadersValue;
  }
}

function waitingHeadersValue(char) {
  if (char === "\r") {
    return waitingHeadersLineEnd;
  } else {
    headerValue += char;
    return waitingHeadersValue;
  }
}

function waitingHeadersLineEnd(char) {
  if (char === "\n") {
    headers[headerName]= headerValue;
    headerName = "";
    headerValue = "";
    return waitingHeadersBlockEnd;
  }
}

function waitingHeadersBlockEnd(char) {
  if (char === "\r") {
    return waitingHeadersBlockEnd;
  } else if (char === "\n"){
    if (headers['Transfer-Encoding'] === "chunked") {
      bodyParser = new TrunkedBodyParser();
    } else {
      // compress/deflate/gzip/identity
    }
    return waitingBody;
  } else {
    return waitingHeadersName(char);
  }
}

function waitingBody(char) {
  bodyParser.receiveChar(char);
  return waitingBody;
}

class ResponseParser {
  constructor() {
  }
  get isFinished() {
    return bodyParser && bodyParser.isFinished;
  }
  get response() {
    statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: headers,
      body: bodyParser.content.join(''),
    }
  }
  receive(string) {
    console.log(string);
    let state = waitingStatusLine;
    for (let char of string) {
      state = state(char);
    }
  }
}

module.exports = ResponseParser;