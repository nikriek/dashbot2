var config = require('./config');
var mongoose = require('mongoose');

var mongoose = mongoose.connect(config.mongo.url);
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var dashboardSchema = new Schema({
    creator: ObjectId,
    slackChannel: String
});

dashboard = mongoose.model('dashboards', dashboardSchema);

var userSchema = new Schema({
    slackUserId : String,
    displayName : String,
    accessToken : String,
    provider    : String,
});
user = mongoose.model('users', userSchema);

module.exports = {
  User: user,
  Dashboard: dashboard
};
