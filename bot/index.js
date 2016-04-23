/*
* @Author: Dat Dev
* @Date:   2016-04-23 16:10:10
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-23 23:29:15
*/

var Promise = require('bluebird');
var Botkit = require('botkit');
var request = require('request-promise');
//TODO: Use token of app
var SLACK_BOT_TOKEN = 'xoxb-37206040724-wkMoGqvYabweh384xRYeeHiy';
var GITHUB_API_URL  = 'https://api.github.com/';
var WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather';
var WEATHER_API_KEY = 'da10088df7a4a9b535842d280d0a05f1';
var GIPHY_API_URL = 'http://api.giphy.com/v1/gifs/search';
var GIPHY_API_KEY = 'dc6zaTOxFJmzC';
var YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/search';

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
        configureGiphy(controller, websocketServer);
        configureYoutube(controller, websocketServer);
    });
}


function getReply() {
    var replies = [
        'Gotcha mate.',
        'Got you fam.',
        'Say no more.',
        'As you command.'
    ];

    return replies[Math.floor(Math.random() * replies.length)];
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
            var temperature = weather.main.temp;
            var condition = weather.weather[0].description;
            var cityName = weather.name;
            var mainCondition = weather.weather[0].main.toLowerCase();
            var icon = (mainCondition === 'clear') 
                ? 'sun-o' 
                : (mainCondition === 'clouds') 
                ? 'cloud' 
                : (mainCondition === 'rain') 
                ? 'tint'
                : (mainCondition === 'extreme')
                ? 'bolt'
                : 'cloud';

            //sun-o, bolt, tint, cloud
            var payload = JSON.stringify({
                type: 'weather',
                data: {
                    degree: temperature,
                    location: cityName,
                    condition: condition,
                    icon: icon
                },
                col:'1',
                row:'1',
                sizex:'1',
                sizey:'1'
            });
            websocketServer.clients.forEach(function(client) { 
                client.send(payload);
            });

            bot.reply(message, getReply());
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
            var payload = JSON.stringify({
                type: 'text',
                data: {
                    content: res
                },
                col:'1',
                row:'1',
                sizex:'2',
                sizey:'3'
            });

            websocketServer.clients.forEach(function(client) {
                client.send(payload);
            });
            bot.reply(message, getReply());
        })
        .catch(function(err) {
            console.error(err);
        });
    });
}

function configureGiphy(controller, websocketServer) {
    controller.hears('mood (\\w+)', 'direct_message,direct_mention,mention', function(bot, message) {
        //TODO: Set based on input mood
        var query = 'cat'
        request({
            uri: GIPHY_API_URL,
            qs: {
                q: query,
                api_key: GIPHY_API_KEY
            },
            json: true
        })
        .then(function(giphs) {
            var giphUrl = giphs.data[0].images.original.url;
            var payload = JSON.stringify({
                type: 'image',
                data: {
                    url: giphUrl
                },
                col:'1',
                row:'1',
                sizex:'2',
                sizey:'3'
            });
            websocketServer.clients.forEach(function(client) {
                client.send(payload);
            });
            bot.reply(message, getReply());
        })
        .catch(function(err) {
            console.error(err);
        });
    });
}


function configureYoutube(controller, websocketServer) {
    controller.hears('youtube (\\w+)', 'direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: YOUTUBE_API,
            qs: {
                q: encodeURI(message.match[1])
                part: 'id,snippet'
            },
            json: true
        })
        .then(function(videos) {
            var videoId = videos.items[0].id.videoId;
            var payload = JSON.stringify({
                type: 'youtube',
                data: {
                    url: 'https://www.youtube.com/embed/' + videoId + '?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1'
                },
                col:'1',
                row:'1',
                sizex:'3',
                sizey:'2'
            });
            websocketServer.clients.forEach(function(client) {
                client.send(payload);
            });
            bot.reply(message, getReply());
        })
        .catch(function(err) {
            console.error(err);
        });
    });
}

