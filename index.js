var express = require('express');
var fs      = require('fs');
var url     = require('url');

// Configs
var PORT     = process.env.HTTP_PORT || 3000;
var AZK_UID  = process.env.AZK_UID;

// Database is configured
var client;
if (process.env.DATABASE_URL) {
  var redis   = require('redis');
  var options = url.parse(process.env.DATABASE_URL);
  client = redis.createClient(options.port, options.hostname);
}

function render(counter) {
  var body = '';
  body += '<center>';
  body += '  <img src="/static/logo.png" />';
  body += '  <h2>instance id: ' + AZK_UID + '</h2>';

  if (counter) {
    body += '  <h3>Redis connected!!!</h3>';
    body += '  <h4>Views: ' + counter + '</h4>';
  }

  body += '</center>';
  return body;
}

// App
var app = express();

// simple logger
app.use(function(req, res, next){
  console.log('%s: %s %s', AZK_UID, req.method, req.url);
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
console.log('Service %s is already done in port: %s', AZK_UID, PORT);
