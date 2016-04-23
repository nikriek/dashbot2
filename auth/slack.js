var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var config = require('../config');
var User = require('../db').User;

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
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({'slackUserId': id}, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
