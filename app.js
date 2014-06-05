
/**
 * Module dependencies.
 */

 //dependencies for each module used
 var express   = require('express')
 , graph     = require('fbgraph')
 var app = express()
 // , app       = module.exports = express.createServer();
 var http = require('http');
 var path = require('path');
 var handlebars = require('express3-handlebars');


// Create `ExpressHandlebars` instance with a default layout.
hbs = handlebars.create({
  defaultLayout: 'main',
    // helpers      : helpers,

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: ['views/partials/'] // ,'shared/templates/']
  });
var app = express();


//load environment variables
var dotenv = require('dotenv');
dotenv.load();

//route files to load
var index = require('./routes/index');
var home = require('./routes/home');
var buyers = require('./routes/buyers');
var newpost = require('./routes/newpost');
var sellers = require('./routes/sellers');
var free = require('./routes/free');
var settings = require('./routes/settings');


//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);
var conf = {
  client_id: process.env.facebook_app_id
  , client_secret: process.env.facebook_app_secret
  , scope: 'email, user_about_me, user_groups, friends_groups, read_stream, manage_pages'
  , redirect_uri: 'https://tritontrade.herokuapp.com/auth/facebook'
    // , redirect_uri: 'http://localhost:3000/auth/facebook'
};

//Configures the Template engine
app.configure(function() {
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', __dirname + '/views');
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//Routes

app.get('/', index.view);

app.get('/auth/facebook', function(req, res) {
  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
      "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
    res.send('access denied');
  }
  return;
}

  // code is set
  // we'll send that and get the access token
  graph.authorize({
    "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    res.redirect('/home');
  });
});

// filter out buyers by keyword "buying" and "looking for"
app.get('/buyers', function(req, res) { 
  graph.get('/331733603546959/feed', function(err, response) {
    var strResp = response.data;
    var buying = [];
    function fakeForLoop(i) {
      if ( i < strResp.length ) {
        var temp = strResp[i].message;
        temp = temp.toLowerCase();
        if (temp.match(/buying/)) {
          buying.push(strResp[i]);
        }
        if (temp.match(/looking\sfor/)) {
          buying.push(strResp[i]);
        }
        if (temp.match(/looking/)) {
          buying.push(strResp[i]);
        }
        if (temp.match(/need/)) {
          buying.push(strResp[i]);
        }
        fakeForLoop(i+1);
      }
    }
    fakeForLoop(0);
    res.render('buyers', buying);
  });
});

// filter out sellers by keyword "selling" and "for sale"
app.get('/sellers', function(req, res) { 
  graph.get('/331733603546959/feed', function(err, response) {
    var strResp = response.data;
    var selling = [];
    function fakeForLoop(i) {
      if ( i < strResp.length ) {
        var temp = strResp[i].message;
        temp = temp.toLowerCase();
        if (temp.match(/selling/)) {
          selling.push(strResp[i]);
        } 
        if (temp.match(/for\ssale/)) {
          selling.push(strResp[i]);
        }
        if (temp.match(/used/)) {
          selling.push(strResp[i]);
        }
        if (temp.match(/obo/)) {
          selling.push(strResp[i]);
        }
        fakeForLoop(i+1);
      }
    }
    fakeForLoop(0);
    res.render('sellers', selling);
  });
});

// filter out free by keyword "free"
app.get('/free', function(req, res) { 
  graph.get('/331733603546959/feed', function(err, response) {
    var strResp = response.data;
    var freeItems = [];
    function fakeForLoop(i) {
      if ( i < strResp.length ) {
        var temp = strResp[i].message;
        temp = temp.toLowerCase();
        if (temp.match(/giving\saway/)) {
          freeItems.push(strResp[i]);
        } 
        fakeForLoop(i+1);
      }
    }
    fakeForLoop(0);
    res.render('free', freeItems);
  });
});

// user gets sent here after being authorized
app.get('/settings', settings.view);
app.get('/home', home.view);
app.post('/home', home.view);
app.post('/', index.view);
// URLS that we can use in our html
app.get('/', index.view);
app.get('/buyers', buyers.view);
app.post('/buyers', buyers.view);
app.get('/sellers', sellers.view);
app.post('/sellers', sellers.view);
app.get('/free', free.view);
app.post('/free', free.view);
app.get('/newpost', newpost.view);
// app.get('/authenticate', log_in.authenticate);
app.post('/auth/facebook/canvas', graph.authorize);
//app.get('/loggedIn', loggedIn.userinfo);


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
