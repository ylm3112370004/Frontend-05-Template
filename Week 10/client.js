const net = require('net');

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.path = options.path || "/";
    this.host = options.host;
    this.port = options.port || 80;
    this.body = this.body || {};
    this.headers = options.headers || {};
    this.bodyText = "";
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/x-www-formed-urlencoded";
    }
    if (headers["Content-Type"] === "application/x-www-formed-urlencoded") {
      // this.bodyText = 
    }
  }
  send(connection) {

  }
}

void async function () {
  let request = new Request({
    host: '127.0.0.1',
    port: 8888,
    path: '/',
    method: 'GET',
    headers: {
      ['x-foo']: "custom",
    },
    body: {
      name: 'ylm',
      age: 32
    }
  });
  let response = await request.send();
  console.log(1);
}();

