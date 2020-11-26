const TrunkedBodyParser = require("./TrunkedBodyParser");

class ResponseParser {
  constructor() {
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.body = null;
    this.waitingStatusLine = function (char) {
      if (char === "\r") {
        return this.waitingStatusLineEnd;
      } else {
        this.statusLine += char;
        return this.waitingStatusLine;
      }
    };
    this.waitingStatusLineEnd = function (char) {
      if (char === "\n") {
        return this.waitingHeadersName;
      }
    }
    this.waitingHeadersName = function (char) {
      if (char === ":") {
        return this.waitingHeadersSpace;
      } else {
        this.headerName += char;
        return this.waitingHeadersName;
      }
    }
    this.waitingHeadersSpace = function (char) {
      if (char === " ") {
        return this.waitingHeadersValue;
      }
    }
    this.waitingHeadersValue = function (char) {
      if (char === "\r") {
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
        return this.waitingHeadersLineEnd;
      } else {
        this.headerValue += char;
        return this.waitingHeadersValue;
      }
    }
    this.waitingHeadersLineEnd = function (char) {
      if (char === "\n") {
        return this.waitingHeadersBlockEnd;
      }
    }
    this.waitingHeadersBlockEnd = function (char) {
      if (char === "\r") {
        return this.waitingHeadersBlockEnd;
      } else if (char === "\n") {
        if (this.headers['Transfer-Encoding'] === "chunked") {
          this.body = new TrunkedBodyParser;
        } else {
          // gzip compress ...
        }
        return this.waitingBody;
      } else {
        return this.waitingHeadersName(char);
      }
    }
    this.waitingBody = function(char) {
      this.body.receive(char);
      return this.waitingBody;
    }
    this.state = this.waitingStatusLine;
  }
  get isFinished() {
    return this.body && this.body.isFinished;
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.body.content.join(''),
    }
  }
  receive(string) {
    console.log(string)
    
    for (let s of string) {
      // if (typeof state !== 'function') {
      //   return;
      // }
      this.state = this.state(s);
    }
  }
}

module.exports = ResponseParser;