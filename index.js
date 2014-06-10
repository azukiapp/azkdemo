var express = require('express');
var fs = require('fs');

// Constants
var PORT     = process.env.PORT || 3000;
var AZK_NAME = process.env.AZK_NAME;

// App
var app = express();

// simple logger
app.use(function(req, res, next){
  console.log('%s: %s %s', AZK_NAME, req.method, req.url);
  next();
});

app.use("/static", express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  var body = '';
  body += '<center>';
  body += '  <img src="/static/logo.png" />';
  body += '  <h2>ID do servidor: ' + AZK_NAME + '</h2>';
  body += '</center>';
  res.send(body);
});

app.listen(PORT);
console.log('Service %s is already done', AZK_NAME);
