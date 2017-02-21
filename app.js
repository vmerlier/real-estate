//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

data = {
    ville: "",
    price: 0,
    codePostal: 0,
    nbPieces: 0,
    surface: 0
}

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {

    if ( req.query.URL ) {
        TellMe( req.query.URL, res );
    }
    else {
        res.render( 'home', {
            message: "Entrez une URL leboncoin",
        });
    }
});


//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});


function TellMe( Url, res ) {


    request( Url.toString(), function ( error, response, html ) {
        if ( !error && response.statusCode == 200 ) {
            var $ = cheerio.load( html );



            data.price = parseInt( $( 'h2.item_price span.value' ).get()[0].children[0].data.replace( /\s/g, '' ), 10 ),

                data.ville = $( 'h2.clearfix span.value' ).get()[1].children[0].data.split( " " )[0],

                data.codePostal = $( 'h2.clearfix span.value' ).get()[1].children[0].data.split( " " )[1].replace( /\n/g, '' ),

                data.nbPieces = $( 'h2.clearfix span.value' ).get()[3].children[0].data,

                data.surface = parseInt( $( 'h2.clearfix span.value' ).get()[5].children[0].data.split( " " )[0], 10 )


            console.log( data.price, data.ville, data.codePostal, data.nbPieces, data.surface );

        }
        else {
            res.render( 'home', {
                message: "URL Invalide",
            });
        }



        search = "https://www.meilleursagents.com/prix-immobilier/" + ( ( data.ville ).toLowerCase() + "-" + data.codePostal + "/" ).toString();

        request( search.toString(), function ( error, response, html ) {


            if ( !error && response.statusCode == 200 ) {
                var $ = cheerio.load( html );

                var meanPrice = parseInt( $( 'div.prices-summary__values div.prices-summary__cell--median' ).get( 1 ).children[0].data.replace( /\s/g, '' ), 10 );

                if ( ( data.price / data.surface ) >= meanPrice ) {
                    console.log( "Mauvais deal" );
                    res.render( 'home', {
                        message: "Mauvais deal",
                    });
                }
                else {
                    console.log( "Bon deal" );
                    res.render( 'home', {
                        message: "Bon deal",
                    });

                }

            }
        });

    });

}


