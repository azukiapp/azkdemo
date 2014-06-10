var express = require('express');
var fs      = require('fs');
var client;

// Constants
var PORT     = process.env.PORT || 3000;
var AZK_NAME = process.env.AZK_NAME;
var REDIS_PORT = process.env.REDIS_PORT;
var REDIS_HOST = process.env.REDIS_HOST;

if (REDIS_PORT && REDIS_HOST) {
  var redis = require('redis');
  client = redis.createClient(REDIS_PORT, REDIS_HOST);
}

function render(counter) {
  var body = '';
  body += '<center>';
  body += '  <img src="/static/logo.png" />';
  body += '  <h2>ID do servidor: ' + AZK_NAME + '</h2>';

  if (counter) {
    body += '  <h3>Views: ' + counter + '</h3>';
  }

  body += '</center>';
  return body;
}

// App
var app = express();

// simple logger
app.use(function(req, res, next){
  console.log('%s: %s %s', AZK_NAME, req.method, req.url);
  next();
});

app.use("/static", express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  // Render with counter
  if (client) {
    client.get("counter", function(err, counter) {
      if (err) console.error(err);
      counter = parseInt(counter || 0) + 1;
      client.set('counter', counter, function(err) {
        if (err) console.error(err);
        res.send(render(counter));
      })
    });
  } else {
    res.send(render());
  }
});

app.listen(PORT);
console.log('Service %s is already done', AZK_NAME);
