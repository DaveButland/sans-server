const AWS = require( 'aws-sdk') ;
const uuid     = require('uuid');
const persist  = require('./persist');
const validateJWT = require('./validateJWT');
const response = require('./response');
const config = require('./config') ;

const s3 = new AWS.S3({signatureVersion: 'v4', signatureCache: false, accessKeyId: config.keys.accessKeyId, secretAccessKey: config.keys.secretAccessKey});

//create a new image. Header must contain a JWT token to identify user and body must contain image information
//function returns the signedURL to load the image
exports.create = (event, context, callback) => {
	AWS.config.update({
		region: "eu-west-2"
	});

	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const body = JSON.parse( event.body ) ;
	const table = 'images' ;
	var image = {} ;
	image.userId    = sub ;
	image.imageId   = uuid.v4() ;
	image.folderId  = body.folderId ;
	image.name      = body.name ;
	image.type      = body.type ;
	image.size      = body.size ;
	image.createdAt = Date.now() ;
	
	var request = "putObject" ;
	var bucket  = "private.sans-caffeine.com"
	var key     = "private/"+image.folderId + "/" + image.imageId ;
 
	persist.create( table, image ).then( function( data ) {
		s3.getSignedUrl( request, {
			Bucket: bucket,
			Key: key,
			Expires: 7200
		}, function(error, data){
			if(error) {
				context.done(error);
			}else{
				console.log( data ) ;
				callback( null, response.success( { signedURL: data } ) ) ;
			}
	})
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
} ;

//get all the images in a folder. Header must contain a JWT token to identify user
exports.getAll = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( "Missing or Invalid Authorization Token");
	}

	//technically, should use sub to ensure we get the right user but we don't need to
	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;
	const table = 'images' ;
	const expression = "folderId = :u" ;
	const values = {":u": folderId } ;

	console.log( table, expression, values ) ;

	persist.read(table, expression, values ).then( function ( folders ) { 
		callback( null, response.success( folders.Items )) ;
	}). catch( function( error) {
		console.log( "Failed to read images " + error ) ;
		callback( null, response.failure( "Could not get images" ) ) ;
	});
} ;