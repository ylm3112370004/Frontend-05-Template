const Request = require('./Request');

void async function() {
  let request = new Request({
    method: "POST",
    path: '/',
    host: '127.0.0.1',
    port: '8088',
    headers: {
      ["X-Foo2"]: 'customed',
    },
    body: {
      name: 'winter'
    }
  });

  let response = await request.send();
  console.log(response);
}();