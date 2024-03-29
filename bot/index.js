/*
* @Author: Dat Dev
* @Date:   2016-04-23 16:10:10
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-24 09:58:05
*/

var Promise = require('bluebird');
var Botkit = require('botkit');
var request = require('request-promise');
var hackerNewsService = require('../service/hackerNewsService');
var productHuntService = require('../service/productHuntService');
var githubService = require('../service/githubService')

//TODO: Use token of app
var SLACK_BOT_TOKEN = 'xoxb-37206040724-wkMoGqvYabweh384xRYeeHiy';
var GITHUB_API_URL  = 'https://api.github.com/';
var WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather';
var WEATHER_API_KEY = 'da10088df7a4a9b535842d280d0a05f1';
var QUOTES_API_URL = 'http://api.forismatic.com/api/1.0/';
var GIPHY_API_URL = 'http://api.giphy.com/v1/gifs/search';
var GIPHY_API_KEY = 'dc6zaTOxFJmzC';

var MAPS_API_KEY = 'AIzaSyBc3vureyEIaTU0sDerZpa5Wd0zgChLtCk';
var YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/search';

var YODA_API_KEY = process.env.YODA_API_KEY || '7fVty9AMDOmshL5MYmokNfw38skRp1jYg9Ujsn9RpzH3s0e4Fl';
var YODA_API_HOST = process.env.YODA_API_HOST || 'https://yoda.p.mashape.com/yoda';

'use strict';

module.exports = {
    start: start
};

function connect(websocketServer) {
    var controller = Botkit.slackbot({debug: false});
    return new Promise(function(resolve, reject) {
        controller.spawn({
            token: SLACK_BOT_TOKEN
        }).startRTM(function(err, bot, payload) {
            if(err) {
                reject(err);
            } else {
                controller.middleware.receive.use(githubService(websocketServer));
                resolve(controller);
            }
        });
    });
}

function start(websocketServer) {
    connect(websocketServer).
    then(function(controller) {
        configureGithubCommitsList(controller, websocketServer);
        configureGithubCommittersList(controller, websocketServer);
        configureGithubTopCommitter(controller, websocketServer);
        configureWeather(controller, websocketServer);
        configureGoogleMaps(controller, websocketServer);
        configureGiphy(controller, websocketServer);
        configureYoutube(controller, websocketServer);
        configureTwitch(controller, websocketServer);
        configureHackerNews(controller, websocketServer);
        configureProductHunt(controller, websocketServer);
        configureQuotes(controller, websocketServer);
        configureCloseWidget(controller, websocketServer);
        configureGitBlame(controller, websocketServer);
        configureYodaify(controller, websocketServer);
    });
}


function getReply() {
    var replies = [
        'Gotcha mate!',
        'Got ya fam!',
        'Say no more.',
        'All righty!',
        'Alrighty!',
        'Damn skippy!',
        'Damn straight!',
        'Forizzle!',
        'Fo sheezie!',
        'Fosheezy!',
        'Fo shizzle!',
        'Fo shizzle my nizzle!',
        'Hells to the yes!',
        'Hells yes!',
        'Hell yeah!',
        'Hot diggety!',
        'Right on!',
        'Rock and roll!',
        'Roger!',
        'Straight!',
        'True dat!',
        'Yessum!',
        'I dig it!'
    ];

    return replies[Math.floor(Math.random() * replies.length)];
}

function errorReply() {
    return 'I can\'t help you. Sorry bro :(';
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
            var temperature = Math.round(weather.main.temp);
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
        })
        .catch(function(err) {
            bot.reply(message, errorReply());
            console.error(err);
        });
    });
}

function configureGithubCommitsList(controller, websocketServer) {
    controller.hears('commits (\\w+) (\\w+)','direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: 'https://api.github.com/repos/' + message.match[1] + '/' +  message.match[2] + '/commits',
            headers: {'User-Agent' : 'herbert'},
            json: true
        })
        .then(function(repository) {
            var payload = JSON.stringify({
                type: 'commits',
                data: {
                    content: repository.slice(0,9)
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
            bot.reply(message, errorReply());
            console.error(err);
        });
    });
}

function configureGithubTopCommitter(controller, websocketServer) {
    controller.hears('top-committer (\\w+) (\\w+)','direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: 'https://api.github.com/repos/' + message.match[1] + '/' +  message.match[2] + '/stats/contributors',
            headers: {'User-Agent' : 'herbert'},
            json: true
        })
        .then(function(stats) {
            var topCommitter = {};
            var total = 0;
            stats.forEach(function(committer){
                if(committer.total < total) return;
                topCommitter = committer;
                total = committer.total;
            });

            if(total === 0) return;

            var payload = JSON.stringify({
                type: 'topCommitter',
                data: {
                    user: topCommitter.author,
                    total: topCommitter.total
                },
                col:'1',
                row:'1',
                sizex:'1',
                sizey:'2'
            });

            websocketServer.clients.forEach(function(client) {
                client.send(payload);
            });
            bot.reply(message, getReply());
        })
        .catch(function(err) {
            bot.reply(message, errorReply());
            console.error(err);
        });
    });
}



function configureGithubCommittersList(controller, websocketServer) {
    controller.hears('committers (\\w+) (\\w+)','direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: 'https://api.github.com/repos/' + message.match[1] + '/' +  message.match[2] + '/stats/contributors',
            headers: {'User-Agent' : 'herbert'},
            json: true
        })
        .then(function(stats) {
            var committers = []
            stats.forEach(function(committer){
                committers.push('[' + committer.total + '] ' + committer.author.login);
            });
            committers.reverse();

            var payload = JSON.stringify({
                type: 'committers',
                data: {
                    content: committers
                },
                col:'1',
                row:'1',
                sizex:'1',
                sizey:'2'
            });

            websocketServer.clients.forEach(function(client) {
                client.send(payload);
            });
            bot.reply(message, getReply());
        })
        .catch(function(err) {
            bot.reply(message, errorReply());
            console.error(err);
        });
    });
}


function configureGoogleMaps(controller, websocketServer) {
    controller.hears('travel from (\\w+) to (\\w+)', 'direct_message,direct_mention,mention', function(bot, message) {
        var from = message.match[1];
        var to   = message.match[2];
        var url  = 'https://www.google.com/maps/embed/v1/directions?origin='
            + encodeURIComponent(from)
            + '&destination='
            + encodeURIComponent(to)
            + '&key='
            + MAPS_API_KEY;

        var payload = JSON.stringify({
            type: 'map',
            data: {
                url: url
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
    });
}

function configureGiphy(controller, websocketServer) {
    controller.hears('gif (\\w+)', 'direct_message,direct_mention,mention', function(bot, message) {
        var query = message.match[1];
        request({
            uri: GIPHY_API_URL,
            qs: {
                q: query,
                api_key: GIPHY_API_KEY
            },
            json: true
        })
        .then(function(gif) {
            var index = Math.floor(Math.random() * gif.data.length);
            var gifUrl = gif.data[index].images.original.url;
            var payload = JSON.stringify({
                type: 'gif',
                data: {
                    url: gifUrl
                },
                col:'1',
                row:'1',
                sizex:'2',
                sizey:'1'
            });
            websocketServer.clients.forEach(function(client) {
                client.send(payload);
            });
            bot.reply(message, getReply());
        })
        .catch(function(err) {
            bot.reply(message, errorReply());
            console.error(err);
        });
    });
}


function configureYoutube(controller, websocketServer) {
    controller.hears('youtube (\\w+)', 'direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: YOUTUBE_API,
            qs: {
                q: encodeURI(message.match[1]),
                part: 'id,snippet',
                key: 'AIzaSyCR5In4DZaTP6IEZQ0r1JceuvluJRzQNLE',
                type: 'video'
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
            bot.reply(message, errorReply());
            console.error(err);
        });
    });
}


function configureTwitch(controller, websocketServer) {
    controller.hears('twitch (\\w+)', 'direct_message,direct_mention,mention', function(bot, message) {
        var channel = message.match[1];
        var payload = JSON.stringify({
            type: 'twitch',
            data: {
                url: 'https://player.twitch.tv/?channel=' + channel
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
    });
}

function configureHackerNews(controller, websocketServer) {
    controller.hears('hn (\\d+)', 'direct_message,direct_mention,mention', function(bot, message) {
        var numberOfStories = message.match[1];
        hackerNewsService.hackerNews({numberOfStories: parseInt(numberOfStories) || 30})
            .then(function(stories) {
                var payload = JSON.stringify({
                    type: 'hackernews',
                    data: {
                        content: stories.split('\n')
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
            }).catch(function(err) {
                bot.reply(message, errorReply());
                console.error(err);
            });
    });
}

function configureProductHunt(controller, websocketServer) {
    controller.hears('ph', 'direct_message,direct_mention,mention', function(bot, message) {
        var numberOfStories = message.match[1];
        productHuntService.productHunt()
            .then(function(stories) {
                var payload = JSON.stringify({
                    type: 'producthunt',
                    data: {
                        content: stories.split('\n')
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
            }).catch(function(err) {
                bot.reply(message, errorReply());
                console.error(err);
            });
    });
}

function configureQuotes(controller, websocketServer) {
    controller.hears('quote', 'direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: 'http://quotes.stormconsultancy.co.uk/random.json',
            json: true
        })
        .then(function (quote) {
            var payload = JSON.stringify({
                type: 'quote',
                data: {
                    content: quote
                },
                col:'1',
                row:'1',
                sizex:'2',
                sizey:'1'
            });
            websocketServer.clients.forEach(function(client) {
                client.send(payload);
            });
            bot.reply(message, getReply());
        }).catch(function (err) {
            bot.reply(message, errorReply());
            console.error(err);
        });
    })

}


function configureCloseWidget(controller, websocketServer) {
    controller.hears('close (\\w+)', 'direct_message,direct_mention,mention', function(bot, message) {
        var payload = JSON.stringify({
            action: 'remove',
            type: message.match[1]
        });
        websocketServer.clients.forEach(function(client) {
            client.send(payload);
        });
        bot.reply(message, getReply());
    })

}

function configureGitBlame(controller, websocketServer) {
    controller.hears('blame (\\w+)','direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: 'https://api.github.com/users/' + message.match[1] + '/events',
            headers: {'User-Agent' : 'herbert'},
            json: true
        })
            .then(function(blamee) {
                var payload = JSON.stringify({
                    type: 'blame',
                    data: {
                        content: blamee.find(function (event) {
                            return event.type == "PushEvent";
                        })
                    },
                    col:'1',
                    row:'1',
                    sizex:'1',
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

function configureYodaify(controller, websocketServer) {
    controller.hears('yoda', 'direct_message,direct_mention,mention', function(bot, message) {
        request({
            uri: 'http://quotes.stormconsultancy.co.uk/random.json',
            json: true
        })
        .then(function(quote) {
            return request({
                uri: YODA_API_HOST,
                qs: {sentence : quote.quote},
                headers: {
                    'X-Mashape-Key': YODA_API_KEY,
                    'Accept': 'text/plain'
                }
            });
        })
        .then(function(yodaQuote) {
            var payload = JSON.stringify({
                type: 'yodaquote',
                data: {
                    content: {
                        quote: yodaQuote, author: 'yoda',
                    }
                },
                col:'1',
                row:'1',
                sizex:'2',
                sizey:'1'
            });
            websocketServer.clients.forEach(function(client) {
                client.send(payload);
            });
            bot.reply(message, getReply());
        }); 
    });
}