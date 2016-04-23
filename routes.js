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
    home: function(req, res) {
        res.render('index');
    },
    index: function(req, res) {
        res.render('pages/dashboards/index');
    },
    create: function(req, res) {
        var dashboardId = uuid.v4();
        res.redirect('/dashboards/' + dashboardId);
    },
    show: function(req, res) {
        var uuid = req.params.dashboardId;
        res.render('pages/dashboards/show', {uuid: uuid});
    },
    authenticateSlack: passportSlack.authenticate('slack'),
    authenticateSlackCallback: passportSlack.authenticate('slack', { successRedirect: '/dashboards',
                                                                     failureRedirect: '/' })
}
