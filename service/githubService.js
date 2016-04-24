/*
* @Author: Dat Dev
* @Date:   2016-04-24 09:13:20
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-24 09:50:06
*/

'use strict';

module.exports = function(websocketServer) {
    return function(bot, message, next) {
        if (message.bot_id !== 'B137AQPPY') {
            return next();
        }
        var text = message.attachments[0]
            .pretext
            .replace('<', '')
            .replace('>', '')
            .replace('|', ' ');

        var payload = JSON.stringify({
            type: 'github',
            data: {
                content: text
            },
            col:'1',
            row:'1',
            sizex:'2',
            sizey:'1'
        });
        websocketServer.clients.forEach(function(client) {
            client.send(payload);
        });
        next();
    }
}