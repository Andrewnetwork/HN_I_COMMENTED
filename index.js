var Curl = require( 'node-libcurl' ).Curl;

var curl = new Curl();

curl.setOpt( 'URL', 'https://news.ycombinator.com/' );
curl.setOpt( 'FOLLOWLOCATION', true );

curl.on( 'end', function( statusCode, body, headers ) {
 
    console.info( statusCode );
    console.info( '---' );
    console.info( body);
    console.info( '---' );
    console.info( this.getInfo( 'TOTAL_TIME' ) );
 
    this.close();
});
 
curl.on( 'error', curl.close.bind( curl ) );
curl.perform();
