/*
* @Author: Dat Dev
* @Date:   2016-04-24 02:00:43
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-24 03:40:45
*/

'use strict';

var Promise = require('bluebird');
var request = require('request-promise');

var DEFAULT_NUMBER_OF_STORIES = 30;
var HACKER_NEWS_BASE_URL = 'https://hacker-news.firebaseio.com/v0';
var HACKER_NEWS_STORIES_PATH = '/newstories.json';
var HACKER_NEWS_STORY_PATH = '/item/:id.json';

module.exports = {
    hackerNews: grabHNStories
};

function grabHNStories(opts) {
    return request({
        uri: HACKER_NEWS_BASE_URL + HACKER_NEWS_STORIES_PATH,
        json: true
    })
    .then(function(newStoryIds) {
        var requests = newStoryIds.sort()
            .slice(0, opts.numberOfStories || DEFAULT_NUMBER_OF_STORIES)
            .map(function(newStoryId) {
                return request({
                    uri: HACKER_NEWS_BASE_URL + HACKER_NEWS_STORY_PATH.replace(':id', newStoryId),
                    json: true
                });
            });
        return Promise.all(requests);
    })
    .then(function(stories) {
        var parsedStories = stories.sort(function(one, two) {
            return two.score - one.score;
        }).map(function(story) {
            return ':score :url :title by :name'
                .replace(':score', story.score)
                .replace(':title', story.title)
                .replace(':url', story.url)
                .replace(':name', story.by);
        })
        .join('\n');

        return Promise.resolve(parsedStories);
    });
};