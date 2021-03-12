const http = require('http');

http.createServer(function(request, response) {
  let body = [];
  request.on('error', function(err) {
    console.log(err)
  }).on('data', function(data) {
    body.push(data);
    console.log(body);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    console.log('body', body);
    response.writeHead(200, {'Content-Type': "text/html"});
    response.end(" hello world!");
  })
}).listen(8888);