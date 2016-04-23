var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var config = require('../config');


console.log(config);

passport.use(new SlackStrategy({
        clientID: config.slack.clientID,
        clientSecret: config.slack.clientSecret,
        callbackURL: config.slack.redirectUri,
        scope: 'identify channels:read chat:write:user'
    }, function(accessToken, refreshToken, profile, done) {

    })
);

module.exports = passport;
