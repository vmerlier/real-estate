//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );
var search = "https://www.meilleursagents.com/prix-immobilier/";


//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {
    res.render( 'home', {
        message: 'The Home Page!', test1: "test !! "
    });
});

//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});




request( 'https://www.leboncoin.fr/ventes_immobilieres/1035860827.htm?ca=12_s', function ( error, response, html ) {
    if ( !error && response.statusCode == 200 ) {
        var $ = cheerio.load( html );

        var price = parseInt( $( 'h2.item_price span.value' ).get()[0].children[0].data.replace( /\s/g, '' ), 10 );

        var ville = $( 'h2.clearfix span.value' ).get()[1].children[0].data.split( " " )[0];

        var codePostal = $( 'h2.clearfix span.value' ).get()[1].children[0].data.split( " " )[1].replace( /\n/g, '' );

        var nbPieces = $( 'h2.clearfix span.value' ).get()[3].children[0].data;

        var surface = parseInt( $( 'h2.clearfix span.value' ).get()[5].children[0].data.split( " " )[0], 10 );

        console.log( price, ville, codePostal, nbPieces, surface );

    }

    search += ( ville.toLowerCase() + "-" + codePostal + "/" ).toString();


    request( search.toString(), function ( error, response, html ) {
        if ( !error && response.statusCode == 200 ) {
            var $ = cheerio.load( html );

            var meanPrice = parseInt( $( 'div.prices-summary__values div.prices-summary__cell--median' ).get( 1 ).children[0].data.replace( /\s/g, '' ), 10 );

            if ( ( price / surface ) >= meanPrice ) {
                console.log( "Mauvais Deal ! " );
            }
            else {
                console.log( "Bon Deal ! " );
            }
        }
    });

});

