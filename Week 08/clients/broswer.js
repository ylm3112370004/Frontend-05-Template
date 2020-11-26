const Request = require('./Request.js'); 

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
      name: 'ylm'
    }
  });
  let response = await request.send();
  console.log(response);
}();
