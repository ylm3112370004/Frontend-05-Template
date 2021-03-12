const Request = require("./Request.js");
const parser = require("./parser.js");

void async function() {
  let request = new Request({
    host: "127.0.0.1",
    port: 8088,
    path: "/",
    method: 'POST',
    headers: {
      "X-foo": "customed"
    },
    body: {
      name: "ylm"
    }
  });
  let response = await request.send();
  parser.parseHTML(response.body);
}()