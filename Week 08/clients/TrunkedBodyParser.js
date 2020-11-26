class TrunkedBodyParser {
  constructor() {
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.end = function(char) {
      return this.end;
    }
    this.waitingLengthLine = function(char) {
      if(char === "\r") {
        return this.waitingLengthLineEnd;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
        if (this.length === 0) {
          this.isFinished = true;
          return this.end;
        }
        return this.waitingLengthLine;
      }
    }
    this.waitingLengthLineEnd = function(char) {
      if (char === "\n") {
        return this.waitingTrunkContent;
      }
    }
    this.waitingTrunkContent = function(char) {
      if (this.length > 0) {
        this.content.push(char);
        this.length--;
        return this.waitingTrunkContent;
      }
      return this.waitingTrunkContentEnd(char);
    }
    this.waitingTrunkContentEnd = function(char) {
      if (char === "\r") {
        return this.waitingTrunkContentEnd;
      } else if (char === "\n") {
        return this.waitingTrunkContentEnd;
      } else {
        return this.waitingLengthLine(char);
      }
    }
    this.state = this.waitingLengthLine;
  }
  receive(char) {
    this.state = this.state(char);
  }
}

module.exports = TrunkedBodyParser;