var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

url = 'https://news.ycombinator.com/submitted?id=BucketSort';

// The structure of our request call
// The first parameter is our URL
// The callback function takes 3 parameters, an error, response status code and the html

request(url, function(error, response, html){

    // First we'll check to make sure no errors occurred when making the request

    if(!error){
        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

        var $ = cheerio.load(html);

        // Finally, we'll define the variables we're going to capture

        var title, release, rating;
        var json = { title : "", release : "", rating : ""};

        console.log($.html())
    }
})

exports = module.exports = app;