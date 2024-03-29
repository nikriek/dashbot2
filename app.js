/*
* @Author: Dat Dev
* @Date:   2016-04-23 13:29:58
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-23 21:18:55
*/

'use strict';

var express = require('express');
var path    = require('path');
var engine  = require('ejs-locals');
var routes  = require('./routes');
var passport = require('passport');
var session = require('express-session');
var config = require('./config');
var bodyParser = require('body-parser');
var RedisStore = require('connect-redis')(session);
var bot = require('./bot/index');
var cookieParser = require('cookie-parser')

var app = express();
var server = require('http').createServer(app);
var websocket = require('./websocketService')(server);

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  store: new RedisStore({url: config.redis.url}),
  resave: true,
  secret: config.secret,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.get('/', routes.home);
app.get('/dashboards', routes.index)
app.post('/dashboards', routes.create);
app.get('/dashboards/:dashboardId', routes.show);
app.get('/auth/slack', routes.authenticateSlack);
app.get('/auth/slack/callback', routes.authenticateSlackCallback);

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
  bot.start(websocket);
});
