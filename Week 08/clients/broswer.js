const Request = require('./Request.js');
const parser = require('./parser');

void async function() {
  let request = new Request({
    method: "POST",
    path: '/',
    host: '127.0.0.1',
    port: 8088,
    headers: {
      ["X-foo"]: 'customed'
    },
    body: {
      name: '杨腊梅'
    }
  });
  let response = await request.send();
  parser.parserHTML(response);
}();
