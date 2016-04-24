var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var config = require('../config');
var User = require('../db').User;

passport.use(new SlackStrategy({
        clientID: config.slack.clientID,
        clientSecret: config.slack.clientSecret,
        callbackURL: config.slack.redirectUri,
        scope: 'bot identify channels:read channels:write chat:write:bot channels:read chat:write:user users:read channels:history groups:write groups:history groups:read'
    }, function(accessToken, refreshToken, profile, done) {
        var user = User()
        user.accessToken = accessToken;
        user.slackUserId = profile.id;
        user.displayName = profile.displayName;
        user.provider = profile.provider;
        user.save(function(err) {
          done(null, user);
        });
    })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
