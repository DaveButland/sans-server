const albums = require('./albums');
const AWS = require( 'aws-sdk') ;
const config = require( './config' ) ;

AWS.config.update({
	region: config.region
});

const s3 = new AWS.S3({signatureVersion: 'v4', signatureCache: false, accessKeyId: config.keys.accessKeyId, secretAccessKey: config.keys.secretAccessKey});

//albums.getImages( '832bb986-871d-4bd2-a832-9e7134265604', 'f7b63276-0be4-4658-9d9c-cc620dc6aba5' ).then( function( data ) { 
//	console.log( data ) ; 
//}) ;

const event = { pathParameters : { userid: '832bb986-871d-4bd2-a832-9e7134265604', albumid: 'f7b63276-0be4-4658-9d9c-cc620dc6aba5'}}

albums.getImagesHandler( event ).then( function ( data ) {
	console.log( data ) ;
}) ;
