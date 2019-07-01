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
		region: config.region
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
	const table = 'sans-images' ;
	var image = {} ;
	image.userId = sub ;
	image.imageId  = uuid.v4() ;
	image.folderId = body.folderId ;
	image.name     = body.name ;
	image.type     = body.type ;
	image.size     = body.size ;
	image.createdAt = Date.now() ;
	
	var request = "putObject" ;
	var bucket  = "private.sans-website.com"
	var key     = "private/" + image.folderId + "/" + image.imageId ;
 
	persist.create( table, image ).then( function( data ) {
		s3.getSignedUrl( request, {
			Bucket: bucket,
			Key: key,
			Expires: 7200
		}, function(error, data) {
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
}

//create a new image. Header must contain a JWT token to identify user and body must contain image information
//function returns the signedURL to load the image
exports.delete = (event, context, callback) => {
	AWS.config.update({
		region: config.region
	});

	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const folderId = event.pathParameters.folderid ;
	const imageId  = event.pathParameters.imagesid ;
	const table = 'sans-images' ;

	const key = { userId: sub, imageId: imageId } ;
	
	console.log( key.userId, key.imageId ) ;

	persist.delete( table, key ).then( function( data ) {
		console.log( response.success( data ) ) ;

		var bucket  = "private.sans-website.com"
		var key     = "private/" + folderId + "/" + imageId ;
	 
		var params = {  Bucket: bucket, Key: key };
	
		s3.deleteObject(params, function(err, data) {
			if (err) { 
				console.log(err, err.stack); 
				callback( null, response.failure({ status: false }) );
			} 
			else {
				callback( null, response.success( "deleted" )) ;
			}
		});
	}) ;
}


//get all the images in a folder. Header must contain a JWT token to identify user
exports.getAll = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( "Missing or Invalid Authorization Token");
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const folderId = event.pathParameters.folderid ;
	const table = 'sans-images' ;
	const index = 'userid-folderid-index' ;
	const expression = "userId = :u and folderId = :f" ;
	const values = {":u": sub, ":f": folderId } ;

	// attach and return cookies with response

	persist.readIndex(table, index, expression, values ).then( function ( images ) { 
		callback( null, response.success( images.Items )) ;
	}). catch( function( error) {
		console.log( "Failed to read images " + error ) ;
		callback( null, response.failure( "Could not get images" ) ) ;
	});
} ;