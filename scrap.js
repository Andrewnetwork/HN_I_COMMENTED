var Curl = require( 'node-libcurl' ).Curl;

var curl = new Curl();

curl.setOpt( 'URL', 'www.google.com' );
curl.setOpt( 'FOLLOWLOCATION', true );

curl.on( 'end', function( statusCode, body, headers ) {
 
    console.info( statusCode );
    console.info( '---' );
    console.info( body.length );
    console.info( '---' );
    console.info( this.getInfo( 'TOTAL_TIME' ) );
 
    this.close();
});
 
curl.on( 'error', curl.close.bind( curl ) );
curl.perform();

var http = require('https');

var options = {
  host: 'news.ycombinator.com',
  port: 80,
  path: '/',
  headers: { accept: '*/*' }
};

var body = '';


http.get(options, function(res) {
  console.log("Got response: " + res.statusCode);


  res.on('data', function(chunk) {
    body += chunk;
  });

  res.on('end', function() {
    console.log(body);
  });

}).on('error', function(e) {
  console.log("Got error: " + e.message);
});