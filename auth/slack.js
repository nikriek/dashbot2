var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var config = require('../config');

passport.use(new SlackStrategy({
        clientID: config.slack.clientID,
        clientSecret: config.slack.clientSecret,
        callbackURL: config.slack.redirectUri,
        scope: 'identify channels:read chat:write:bot users:read'
    }, function(accessToken, refreshToken, profile, done) {
        done(null, profile);
    })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});

module.exports = passport;
