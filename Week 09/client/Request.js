const net = require('net');
const ResponseParser = require("./ResponseParser.js");

class Request {
  constructor(options) {
    this.host = options["host"];
    this.port = options["port"] || 80;
    this.path = options["path"] || "/";
    this.method = options["method"] || "GET";
    this.headers = options["headers"] || Object.create(null);
    this.body = options["body"] || {};
    this.body["age"] = "十六";
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      // {name: "ylm"}  name=ylm&age=15 注意中文要加密
      this.bodyText = Object.entries(this.body).map(d => `${d[0]}=${encodeURIComponent(d[1])}`).join("&");
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      let responseParser = new ResponseParser();
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }
      connection.on("data", data => {
        responseParser.receive(data.toString());
        if (responseParser.isFinished) {
          resolve(responseParser.response);
          console.log("ylm end")
          connection.end();
        }
      })
      connection.on("error", (err) => reject(err));
    })
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\n")}\n\n${this.bodyText}`
  }
}

module.exports = Request;