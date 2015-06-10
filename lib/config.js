var path      = require('path');
var express   = require('express');
var exphbs    = require('express-handlebars');
var locale    = require('locale');
var supported = new locale.Locales(["pt_BR", "en", "en_US"]);
var AZK_UID   = process.env.AZK_UID;

// App Config
function Config(app) {

  // Creating express-handlebars instance with step's partials already registered
  var hbs = exphbs.create({partialsDir: ['./views/steps/']});

  // Create simple logger middleware
  app.use(function(req, res, next){
    console.log('%s: %s %s', AZK_UID, req.method, req.url);
    next();
  });

  // Supports en_US and pt_BR
  app.use(locale(supported));

  // Setup views with handlebars engine
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');

  // Config static path for assets middleware
  app.use('/static', express.static(path.join(__dirname, '../public')));
}

module.exports = Config;
