// 解析一下代码
/**
HTTP/1.1 200 OK
Content-Type: text/html
Date: Mon, 01 Feb 2021 13:36:29 GMT
Connection: keep-alive
Transfer-Encoding: chunked

195
<html local="en">
      <head></head>
      <style>
        body div #myid {
          width: 100px;
          height: 100px;
          background-color: #ff5000;
        }
        body div img {
          width: 30px;
          background-color: #ff1111;
        }
      </style>
      <body checked=true>
        <div>
          <img id="myid"/>
          <img/>
        </div>
      </body>
    </html>
0
 */

let statusLine = "";
let headers = Object.create(null);
let headerName = "";
let headerValue = "";
let body = null;

const waitingStatusLine = (c) => {
  if (c === "\r") {
    return waitingStatusLineEnd;
  } else {
    statusLine += c;
    return waitingStatusLine;
  }
}

const waitingStatusLineEnd = (c) => {
  if (c === "\n") {
    return waitingHeadersName;
  }
}

const waitingHeadersName = (c) => {
  if (c === ":") {
    return waitingHeadersSpace;
  } else {
    headerName += c;
    return waitingHeadersName;
  }
}

const waitingHeadersSpace = (c) => {
  if (c === " ") {
    return waitingHeadersValue;
  }
}

const waitingHeadersValue = (c) => {
  if (c === "\r") {
    headers[headerName] = headerValue;
    headerName = "";
    headerValue = "";
    return waitingHeadersLineEnd
  } else {
    headerValue += c;
    return waitingHeadersValue;
  }
}

const waitingHeadersLineEnd = (c) => {
  if (c === "\n") {
    return waitingHeadersBlockEnd;
  }
}

const waitingHeadersBlockEnd  = (c) => {
  if (c === "\r") {
    return waitingHeadersBlockEnd;
  } else if (c === "\n") {
    if (headers["Transfer-Encoding"] === "chunked") {

      body = new ChunkedBodyParser();
      return waitingBody;
    } else if (false) {
      // 多种chunked
    }
  } else {
    return waitingHeadersName(c);
  }
}

const waitingBody = (c) => {
  body.receive(c);
  return waitingBody;
}

class ChunkedBodyParser {
  constructor() {
    this.isFinished = false;
    this.content = [];
    this.length = 0;
    this.end = () => {
      return this.end;
    }
    this.waitingLengthLine = (c) => {
      if (c === "\r") {
        return this.waitingLengthLineEnd;
      } else {
        this.length *= 16;
        this.length += parseInt(c, 16);

        if (this.length === 0) {
          this.isFinished = true;
          return this.end;
        }
        return this.waitingLengthLine;        
      }
    }

    this.waitingLengthLineEnd = (c) => {
      if (c === "\n") {
        return this.waitingTrunkedContent;
      }
    }
    this.waitingTrunkedContent = (c) => {
      if (this.length > 0) {
        this.content.push(c);
        this.length--;
        // console.log(c.codePointAt(0), c);
        return this.waitingTrunkedContent;
      }
      return this.waitingTrunkedContentEnd;
    }
    this.waitingTrunkedContentEnd = (c) => {
      if (c === "\r") {
        return this.waitingTrunkedContentEnd;
      } else if (c === "\n") {
        return this.waitingTrunkedContentEnd;
      } else {
        return this.waitingLengthLine(c);
      }
    }
    this.state = this.waitingLengthLine;
  }
  receive(c) {
    // console.log(c);s
    this.state = this.state(c);
  }
}

class ResponseParser {
  constructor() {
    this.state = waitingStatusLine;
  }
  get isFinished() {
    return body && body.isFinished;
  }
  get response() {
    statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: headers,
      body: body.content.join(""),
    }
  }
  receive(string) {
    for (let c of string) {
      this.state = this.state(c);
    }
  }
}

module.exports = ResponseParser;