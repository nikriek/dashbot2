var config = require('./config');
var mongoose = require('mongoose');

var db = mongoose.connect(config.mongo.url);

var userSchema = new mongoose.Schema({
    slackUserId : String,
    displayName : String,
    accessToken : String,
    provider    : String
});


user = db.model('users', userSchema);

module.exports = {
  User: user
};
