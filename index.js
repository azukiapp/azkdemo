var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.end('<center><h1>Port: ' + process.env.PORT + '</h1></center>\n');
}).listen(process.env.PORT);
console.log('Server running');
