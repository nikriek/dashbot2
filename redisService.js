/*
* @Author: Dat Dev
* @Date:   2016-04-23 14:38:07
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-23 15:34:18
*/

'use strict';

var config = require('./config');
var client = require('redis').createClient({host: config.redis.host});
var Promise = require('bluebird');

client.on('err', function(err) {
    console.error(err);
});

module.exports = {
    set: function(key, value) {
        return new Promise(function(resolve, reject) {
            client.set(key, value, function(err, reply) {
                if(err) {
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    },
    get: function(key) {
        return new Promise(function(resolve, reject) {
            client.get(key, function(err, reply) {
                if(err) {
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }
}
