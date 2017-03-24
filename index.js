var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var hcom    = require("./HNCOMM.js");

var newsRootURL = "https://news.ycombinator.com"
var currLinks   = [];
var url         = 'https://news.ycombinator.com/threads?id=BucketSort';
var beatMS      = 50000;

var a = new hcom.HNCOMM(2,3);

// The structure of our request call
// The first parameter is our URL
// The callback function takes 3 parameters, an error, response status code and the html

request(url, function(error, response, html){

    // First we'll check to make sure no errors occurred when making the request

    if(!error){
        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

        var $ = cheerio.load(html);
        var links = [];
        var linkAr = []; 

        $('.athing,.comtr').filter(function(){
            var data    = $(this).find('.comhead');
            var storyOn = data.find(".storyon");
            var son     = storyOn.find('a')

            if(son.html() != null){
                var idx = newsRootURL+"/"+son.attr("href")
                if(links[idx] == null ){
                    links[idx]=1;
                    linkAr.push(idx);
                }
            }
            
        })

        currLinks = linkAr;
    }
})

function heartBeat(){
    request(url, function(error, response, html){
        // First we'll check to make sure no errors occurred when making the request

        if(!error){
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                var $      = cheerio.load(html);
                var links  = [];
                var linkAr = []; 

                $('.athing,.comtr').filter(function(){
                    var data    = $(this).find('.comhead');
                    var storyOn = data.find(".storyon");
                    var son     = storyOn.find('a')

                    if(son.html() != null){
                        var idx = newsRootURL+"/"+son.attr("href")
                        if(links[idx] == null ){
                            links[idx]=1;
                            linkAr.push(idx)
                        }
                        
                    }
                    
                })
            
                console.log(currLinks[0] + "   "+ linkAr[0])
                if(currLinks[0] != linkAr[0]){
                    console.log("New link: "+linkAr[0]);
                    
                    currLinks = linkAr;
                }
                else
                {
                    console.log("No new links.");
                }
            }
        })
    }

setInterval(heartBeat,beatMS);