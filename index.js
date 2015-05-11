var express   = require('express');
var url       = require('url');

// Configs
var PORT      = process.env.HTTP_PORT || 3000;
var AZK_UID   = process.env.AZK_UID;
var azkInstanceData = {
  seq: null,    // instance sequence
  uid: AZK_UID  // instance ID
};

// Database is configured
var client;
if (process.env.DATABASE_URL) {
  var redis   = require('redis');
  var options = url.parse(process.env.DATABASE_URL);
  client = redis.createClient(options.port, options.hostname);
}

// Create Express app
var app = express();

// Config app with simple logger middleware,
// simples locale, view engine and static assets
require('./config')(app);

// Which layout handlebars will render
var layout;

// Route
app.get('/', function(req, res) {
  layout = (req.locale == 'pt_BR') ? 'index_pt_br' : 'index_en';

  // fill `seq` with the container that processed the request
  azkInstanceData.seq = process.env.AZK_SEQ;

  if (client) {
    // if database is plugged
    client.get('counter', function(err, counter) {
      if (err) console.error(err);
      counter = parseInt(counter || 0) + 1;
      client.set('counter', counter, function(err) {
        if (err) console.error(err);
        res.render(layout, {
          client: true,
          counter: counter,
          azkData: azkInstanceData,
          step: 'commands'
        });
      })
    });
  } else {
    // database is missing
    res.render(layout, {
      azkData: azkInstanceData,
      client: false,
      counter: false,
      step: 'database'
    });

  }
});

app.listen(PORT);
console.log('Service %s is already done in port: %s', AZK_UID, PORT);
