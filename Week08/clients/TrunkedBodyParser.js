// 1. 在每一个分块的开头需要添加当前分块的长度，以十六进制的形式表示，后面紧跟着 '\r\n' ，
// 2. 之后是分块本身，后面也是'\r\n' 。
// 3. 终止块是一个常规的分块，不同之处在于其长度为0。
// 4. 终止块后面是一个挂载（trailer），由一系列（或者为空）的实体消息首部构成。

let length = 0;
let content = [];

function end() {
  return end;
}

function waitingLength(char) {
  if (char === "\r") {
    return waitingLengthLineEnd;
  } else {
    length = length * 16 + parseInt(char, 16);
    if (length === 0) {
      return end;
    }
    return waitingLength;
  }
}

function waitingLengthLineEnd(char) {
  if(char === "\n") {
    return waitingContentLine;
  } else {
    return waitingLength;
  }
}

function waitingContentLine(char) {
  if (length > 0) {
    content.push(char);
    length--;
    return waitingContentLine;
  } else if(char === "\r") {
    return waitingContentLineEnd;
  }
}

function waitingContentLineEnd(char) {
  if (char === "\n") {
    return waitingLength;
  }
}

class TrunkedBodyParser {
  constructor() {
    this.isFinished = false;
    this.state = waitingLength;
  }
  get content() {
    return content;
  }
  receiveChar(char) {
    // console.log(this.state);
    this.state = this.state(char);
    if (this.state === end) {
      this.isFinished = true;
    }
  }
}


module.exports = TrunkedBodyParser;