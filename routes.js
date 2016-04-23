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

module.exports = {
    index: function(req, res) {
        res.render('index');
    },
    new: function(req, res) {
        res.render('new');
    },
    create: function(req, res) {
        var dashboardId = uuid.v4();
        var slackAccessToken = req.body.accessToken || '';
        var bot = req.body.bot || {};

        if(slackAccessToken === '') {
            res.json(400, {error: 'Missing accessToken'});
            return;
        }

        bot.accessToken = slackAccessToken;
        redisClient.set(dashboardId, JSON.stringify(bot))
            .then(function(redisResponse) {
                res.redirect('/dashboards/' + dashboardId);
            })
            .catch(function(err) {
                res.json(500, {error: err})
            });
    },
    dashboard: function(req, res) {
        var uuid = req.params.dashboardId;
        res.render('pages/dashboard', {uuid: uuid});
    },

    authenticateSlack: passportSlack.authenticate('slack'),

    authenticateSlackCallback: passportSlack.authenticate('slack', { successRedirect: '/dashboards/new',
                                                                     failureRedirect: '/' })
}
