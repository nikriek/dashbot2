/*
* @Author: Dat Dev
* @Date:   2016-04-23 13:29:58
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-23 15:21:12
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

var app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use(session({
  store: new RedisStore({url: config.redis.url}),
  secret: config.secret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.post('/dashboards', routes.create);

app.get('/', routes.index);
app.get('/dashboards/new', routes.new)
app.get('/dashboards/:dashboardId', routes.show);

app.get('/auth/slack', routes.authenticateSlack);
app.get('/auth/slack/callback', routes.authenticateSlackCallback, function(req, res) {
    console.log(req);
    res.json({});
  });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
