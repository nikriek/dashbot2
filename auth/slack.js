var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var config = require('../config');

passport.use(new SlackStrategy({
        clientID: config.slack.clientID,
        clientSecret: config.slack.clientSecret,
        callbackURL: config.slack.redirectUri,
        scope: 'identify channels:read chat:write:user users:read'
    }, function(accessToken, refreshToken, profile, done) {

    })
);

module.exports = passport;
