var request = require('request');
var cheerio = require('cheerio');
var Slack   = require('slack-node');

//####### GLOBALS ##########
var app         = express();
var newsRootURL = "https://news.ycombinator.com"
var currLinks   = [];
var url         = 'https://news.ycombinator.com/threads?id=BucketSort';
var beatMS      = 50000;
var webHookAddr = "https://hooks.slack.com/services/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";
//###### END GLOBALS ##########

// On load call. Gets current state of comments. 
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

// Called every beatMS, this function checks if we have a new comment and updates the current link array if there is after posting to slack. 
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
                    getTitleAndPost(linkAr[0]);
                    var txt = getTitle(linkAr[0])+" - "+linkAr[0];
                    postToSlack(txt)
                    currLinks = linkAr;
                }
                else
                {
                    console.log("No new links.");
                }
            }
        })
}

// Get's the title of the link address and posts it to slack with the link. 
function getTitleAndPost(linkAddr){
    url = linkAddr;

    var a = request(url, function(error, response, html){
        if(!error){
            var $      = cheerio.load(html);
            var title = $('.storylink')[0]["children"][0].data;
            postToSlack(title+" - "+linkAddr);
        }
    })
}

function postToSlack(txt){
   slack = new Slack();
   slack.setWebhook(webHookAddr);
   slack.webhook({
        channel: "#general",
        username: "HN_I_COMMENTED",
        text: txt
        }, function(err, response) {
        console.log("Sent to slack.");
    });
}

//getTitleAndPost("https://news.ycombinator.com/item?id=13945492");
//postToSlack("https://news.ycombinator.com/item?id=13946258");

setInterval(heartBeat,beatMS);