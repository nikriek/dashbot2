/*
* @Author: Dat Dev
* @Date:   2016-04-24 04:08:30
* @Last Modified by:   Stefan Wirth
* @Last Modified time: 2016-04-24 04:13:34
*/

'use strict';

var Promise = require('bluebird');
var request = require('request-promise');

var PRODUCT_HUNT_ACCESS_TOKEN = process.env.PRODUCT_HUNT_API_KEY || '433ecb57ef3b588881496394ea2fea5c35a8d3b85f29e6dadf6e3b9711963dd7';
var PRODUCT_HUNT_BASE_URL = 'https://api.producthunt.com/v1/';
var PRODUCT_HUNT_POSTS_PATH = '/posts';

module.exports = {
    productHunt: grabPHPosts
};

function grabPHPosts() {
    return request({
        uri: PRODUCT_HUNT_BASE_URL + PRODUCT_HUNT_POSTS_PATH,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + PRODUCT_HUNT_ACCESS_TOKEN,
        },
        json: true
    })
    .then(function(response) {
        var posts = response.posts;
        var parsedPosts = posts.sort(function(one, two) {
            return two.votes_count - one.votes_count;
        }).map(function(post) {
            return ':score :title'
                .replace(':score', post.votes_count)
                .replace(':title', post.name);
        })
        .join('\n');

        console.log(parsedPosts);

        return Promise.resolve(parsedPosts);
    });
}