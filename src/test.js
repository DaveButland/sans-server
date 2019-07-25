const AWS = require('aws-sdk') ;
const config = require('./config') ;
const persist = require('./persist') ;

AWS.config.update({
	region: config.region
});

const s3 = new AWS.S3({signatureVersion: 'v4', signatureCache: false, accessKeyId: config.keys.accessKeyId, secretAccessKey: config.keys.secretAccessKey});

const dave = "da508140-a652-4230-beea-c36f20cb6132" ; 
const quyen = "832bb986-871d-4bd2-a832-9e7134265604" ;

// const folderId = event.pathParameters.folderid ;

const table = 'sans-folders' ;
const expression = "userId = :u" ;
const values = {":u": dave } ;

// attach and return cookies with response

persist.read( table, expression, values ).then( function ( results ) { 
//	console.log( images ) ;
	results.Items.map( function ( result ) { 
//		result.userId = quyen ;
		console.log( result ) ;
		const key = { userId: dave, folderId: result.folderId } ;
		persist.delete( table, key ).then( function ( response ) { console.log( response ) } ) ;

//		persist.delete( table, key ).then( function ( result ) { 
//			console.log( result ) 
//		}) ;
	} ) ;
}). catch( function( error) {
	console.log( "Failed to read images " + error ) ;
});
