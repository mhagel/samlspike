var express = require('express'),
  http = require('http'),
  path = require('path'),
  passport = require('passport'),
  user = require('./authorization.js'),
  authentication = require('passport');

var env = process.env.NODE_ENV || 'development',
  config = require('./config/config')[env];

require('./config/passport')(passport, config);


var app = express();

app.configure(function () {
  app.set('port', config.app.port);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session(
    {
      secret: 'spike'
    }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  //connect-roles:
  app.use(authentication);
  app.use(user.middleware());
});

app.configure('development', function () {
  console.log ("Development mode.");
  app.use(express.errorHandler());
});
app.configure ('production', function () {
  console.log ("Production mode.");
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500', { error: err }); 
});

app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404',
      {
        url : req.url
      });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});




require('./config/routes')(app, config, passport);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
