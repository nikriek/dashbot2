/*
* @Author: Dat Dev
* @Date:   2016-04-23 16:10:10
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-23 21:47:30
*/

var Promise = require('bluebird');
var Botkit = require('botkit');
var request = require('request-promise');
//TODO: Use token of app
var SLACK_BOT_TOKEN = 'xoxb-37206040724-wkMoGqvYabweh384xRYeeHiy';
var GITHUB_API_URL  = 'https://api.github.com/';
var WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather';
var WEATHER_API_KEY = 'da10088df7a4a9b535842d280d0a05f1';

'use strict';

module.exports = {
    start: start
};

function connect() {
    var controller = Botkit.slackbot({debug: false});
    return new Promise(function(resolve, reject) {
        controller.spawn({
            token: SLACK_BOT_TOKEN
        }).startRTM(function(err, bot, payload) {
            if(err) {
                reject(err);
            } else {
                resolve(controller);
            }
        });
    });
}

function start(websocketServer) {
    connect().
    then(function(controller) {
        configureGithub(controller, websocketServer);
        configureWeather(controller, websocketServer);
    });
}

function configureWeather(controller, websocketServer) {
    controller.hears('weather (\\w+)', 'direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: WEATHER_API_URL,
            qs: {
                q: message.match[1],
                units: 'metric',
                appId: WEATHER_API_KEY
            },
            json: true
        })
        .then(function(weather) {
            console.log(weather);
            var temperature = weather.main.temp;
            var clouds = weather.clouds.all; 
            console.log(temperature);
            console.log(clouds);
            var payload = {temp: temperature, clouds: clouds};
            bot.reply(message, temperature + ' ' + clouds + '% clouds');
        });
    });
}

function configureGithub(controller, websocketServer) {
    controller.hears('commits (\\w+)','direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: GITHUB_API_URL + 'search/repositories',
            qs: {q: message.match[1]},
            headers: {'User-Agent' : 'herbert'},
            json: true
        })
        .then(function(repositories) {
            var repositoryId = repositories.items[0].id;
            return request({
                uri: GITHUB_API_URL + 'repositories/' + repositoryId + '/commits',
                qs: {per_page: 10},
                headers: {'User-Agent' : 'herbert'},
                json: true
            })
        })
        .then(function(commits) {
            var res = '';
            commits.forEach(function(commit) {
                var commit = commit.commit;
                res += '[' + commit.author.name + '] ' + commit.message;
                res += '\n';
            });
            websocketServer.clients.forEach(function(client) {
                var payload = {
                    type: 'text',
                    data: {
                        content: res
                    },
                    'col':'1',
                    'row':'1',
                    'sizex':'2',
                    'sizey':'3'
                }
                client.send(JSON.stringify(payload));
            });
            bot.reply(message, res);
        })
        .catch(function(err) {
            console.error(err);
        });
    });
}