/*
* @Author: Dat Dev
* @Date:   2016-04-23 13:29:58
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-23 13:48:43
*/

'use strict';

var express = require('express');
var path    = require('path');
var engine  = require('ejs-locals');
var routes  = require('./routes');
var passport = require('passport');
var session = require('express-session');
var config = require('./config');

var app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.get('/', routes.index);

router.get('/auth/slack', routes.authenticateSlack);
router.get('/auth/slack/callback', routes.authenticateSlackCallback);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
