var passport = require('passport');
var SlackStrategy = require('passport-slack');
var config = require('../config');

passport.use(new SlackStrategy({
    consumerKey: config.slack.clientID,
    consumerSecret: config.slack.clientSecret,
    callbackURL: config.slack.redirectUri
  },

  function(accessToken, refreshToken, profile, done) {

  }
));

module.exports = passport;
