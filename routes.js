/*
* @Author: Dat Dev
* @Date:   2016-04-23 13:31:31
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-23 15:08:12
*/

'use strict';

var passportSlack = require('./auth/slack');
var uuid = require('node-uuid');
var redisClient = require('./redisService');
var SlackWebClient = require('slack-client/lib/clients/web/client');
var Dashboard = require('./db').Dashboard;
var mongoose = require('mongoose');
var config = require('./config');

module.exports = {
    home: function(req, res) {
        res.render('index');
    },
    index: function(req, res) {
        var accessToken = req.user.accessToken;
        var slackClient = new SlackWebClient(accessToken);
        slackClient.groups.list(function(err, groups) {
          res.render('pages/dashboards/index', {groups: groups.groups});
        });
    },
    create: function(req, res) {
        var channelId = req.body.group;
        var accessToken = req.user.accessToken;
        var slackClient = new SlackWebClient(accessToken);
        var dashboard = new Dashboard();
        dashboard.slackChannel = channelId;
        dashboard.creator = req.user;
        dashboard.save(function(err) {
          res.redirect('/dashboards/' + dashboard.id);
        })
    },
    show: function(req, res) {
        var dashboardId = req.params.dashboardId;
        Dashboard.findById(dashboardId, function(err, dashboard) {
          res.render('pages/dashboards/show', {dashboardId: dashboard.id, websocket_url: config.websocket.url});
        });
        /*var history = slackClient.channels.history(channelId, {count: 50}, function(err, history) {
          res.redirect('/dashboards/' + dashboardId);
        })*/

    },
    authenticateSlack: passportSlack.authenticate('slack'),
    authenticateSlackCallback: passportSlack.authenticate('slack', { successRedirect: '/dashboards',
                                                                     failureRedirect: '/' })
}
