var transporter = null;

if (process.env.MAIL_SMTP_HOST) {
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');

  transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    ignoreTLS: true,
  }));
}

module.exports = function(app) {
  var server = require('http').Server(app);

  if (process.env.SERVICES_ENABLE) {
    var io = require('socket.io')(server);
    if (process.env.DATABASE_URL) {
      var redis = require('socket.io-redis');
      io.adapter(redis({
        host: process.env.REDIS_6379_HOST,
        port: process.env.REDIS_6379_PORT
      }));
    }

    var bodyParser = require('body-parser')
    app.use( bodyParser.json() );   // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
      extended: true
    }));

    app.get('/webhooks', function(req, res) {
      io.sockets.emit('msgs', req.param("msg"));
      res.send("Message sent");
    });

    app.post('/mail', function(req, response) {
      if (transporter) {
        var mail = {
          from: 'everton@azukiapp.com',
          to: req.param("email"),
          subject: 'test',
          text: req.param("mensage")
        };

        console.log(mail);

        transporter.sendMail(mail, function(err, mail_result) {
          var msg = "E-mail sent to " + mail.from;
          response.end(msg);
        });
      } else {
        response.end("mail not active, try azk start mail");
      }
    })
  }

  return server;
}
