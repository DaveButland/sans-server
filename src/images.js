const AWS = require( 'aws-sdk') ;
const uuid     = require('uuid');
const persist  = require('./persist');
const validateJWT = require('./validateJWT');
const response = require('./response');
const cookies = require('./cookies');
const config = require('./config') ;

AWS.config.update({
	region: config.region
});

const s3 = new AWS.S3({signatureVersion: 'v4', signatureCache: false, accessKeyId: config.keys.accessKeyId, secretAccessKey: config.keys.secretAccessKey});

//create a new image. Header must contain a JWT token to identify user and body must contain image information
//function returns the signedURL to load the image
exports.create = (event, context, callback) => {

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
	const image = JSON.parse( event.body ) ;
	image.userId    = sub ;
	image.imageId   = uuid.v4() ;
	image.createdAt = Date.now() ;
	
	var request = "putObject" ;
	var bucket  = "private.sans-website.com"
	var key     = "private/" + image.folderId + "/" + image.imageId ;
 
	// remove the put here. Just generate a new uuid and signed url. Once the image is uploaded the client will then call update to add the image
//	persist.put( table, image ).then( function( data ) {
		s3.getSignedUrl( request, {
			Bucket: bucket,
			Key: key,
			Expires: 7200
		}, function(error, data) {
			if(error) {
				context.done(error);
				callback( null, response.failure( { status: error } ) ) ;
			}else{
				console.log( data ) ;
				callback( null, response.success( { image: image, signedURL: data } ) ) ;
			}
		})
//	}).catch ( function (error ) {
//		console.log( "error=" + error) ;
//		callback( null, response.failure({ status: false }) );
//	}) ;
}

//Update an image record - does more or less the same as create. 
exports.update = (event, context, callback) => {

	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const image = JSON.parse( event.body ) ;
	const table = 'sans-images' ;
	image.userId    = sub ; // check this is the same first? what other fields do we want to enforce?
	
	persist.put( table, image ).then( function( data ) {
		callback( null, response.success( image))
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//Delete image record and image files
exports.delete = (event, context, callback) => {

	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	//need to get folder from existing record. 
	const folderId = event.pathParameters.folderid ;
	const imageId  = event.pathParameters.imagesid ;
	const table = 'sans-images' ;

	const key = { userId: sub, imageId: imageId } ;
	
	console.log( key.userId, key.imageId ) ;

	persist.delete( table, key ).then( function( data ) {
		console.log( response.success( data ) ) ;

		var bucket  = "private.sans-website.com"
		var orig_key     = "private/" + folderId + "/" + imageId ;
		var thumb_key     = "thumbnail/" + folderId + "/" + imageId + '-300' ;
	 
		var orig_params = {  Bucket: bucket, Key: orig_key };
		var thumb_params = {  Bucket: bucket, Key: thumb_key };
	
		s3.deleteObject(orig_params, function(err, data) {
			if (err) { 
				console.log(err, err.stack); 
				callback( null, response.failure({ status: false }) );
			} 
			else {
				s3.deleteObject(thumb_params, function(err, data) {
					if (err) { 
						console.log(err, err.stack); 
						callback( null, response.failure({ status: false }) );
					} 
					else {
						callback( null, response.success( "deleted" )) ;
					}
				});
					}
		});
	}) ;
}

//get all the images in a folder. Header must contain a JWT token to identify user
exports.get = (event, context, callback) => {	
	const quyen = '832bb986-871d-4bd2-a832-9e7134265604' ;
	const imageId  = event.pathParameters.imageid ;
	const table = 'sans-images' ;
	const key = { userId: quyen, imageId: imageId } ;
	
	persist.get( table, key ).then( function( data ) {
		callback( null, response.success( data.Item )) ;
	}). catch( function( error) {
		console.log( "Failed to read images " + error ) ;
		callback( null, response.failure( "Could not get image" ) ) ;
	});
} ;

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

//get all public images. No JWT token required and temporary cookie returned with images
exports.getpublic = (event, context, callback) => {
	
	let domain = event["queryStringParameters"]["domain"];

//	const sub = 'da508140-a652-4230-beea-c36f20cb6132' ; // hard coded user for now
	const quyen = '832bb986-871d-4bd2-a832-9e7134265604' ;
//	const folderId = 'be4d4ba9-388c-4715-8634-cf5cf40d0f8c' ; // hard coded folder for now
	const folderId = '80cd6156-4630-42df-8342-215b58eb4459' ;

	const table = 'sans-images' ;
	const index = 'userid-folderid-index' ;
	const expression = "userId = :u and folderId = :f" ;
	const values = {":u": quyen, ":f": folderId } ;

	persist.readIndex(table, index, expression, values ).then( function ( result ) { 
		const images = result.Items ;
		cookies.getImageCookies( images, domain, function( error, cookies ) { 
			callback( null, response.success( { images: images, cookies: cookies } ) ) 
		}) ; 
	}).catch( function( error) {
		console.log( "Failed to read images " + error ) ;
		callback( null, response.failure( "Could not get images" ) ) ;
	});
} ;