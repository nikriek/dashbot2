/*
* @Author: Dat Dev
* @Date:   2016-04-23 13:31:31
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-23 13:48:55
*/

'use strict';

var passportSlack = require('./auth/slack');

module.exports = {
    index: function(req, res) {
        res.render('index');
    }

    authenticateSlack: passportSlack.authenticate('slack'),

    authenticateSlackCallback: passportLinkedIn.authenticate('slack', { failureRedirect: '/' }),
    function(req, res) {
      res.json(req.user);
    })
}
