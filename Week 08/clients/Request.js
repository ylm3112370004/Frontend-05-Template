const net = require('net');
const ResponseParser = require('./ResponseParser');

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.path = options.path || '/';
    this.host = options.host;
    this.port = options.port || 80;
    this.headers = options.headers || {};
    this.body = options.body || {};
    this.bodyText = "";

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${this.body[key]}`).join('&');
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      let parser = new ResponseParser();
      // console.log(this.toString());
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port,
        }, () => {
          connection.write(this.toString());
        })
      }
      connection.on('data', data => {
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      })
      connection.on('error', err => reject(err));
    });
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("s\n")}\n\n${this.bodyText}`;
  }
}

module.exports = Request;