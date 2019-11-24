const uuid     = require('uuid');
const persist  = require('./persist');
const validateJWT = require('./validateJWT');
const response = require('./response');

//create a new albumn
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
	const table = 'sans-albums' ;
	var sans_album         = {} ;
	sans_album.userid      = sub ;
	sans_album.albumid     = uuid.v4() ;
	sans_album.title       = body.title ;
	sans_album.description = body.description ;
	sans_album.cover       = body.cover ;
	sans_album.images      = body.images ;
	sans_album.private     = body.private ;
	sans_album.createdAt   = Date.now() ;
	
	persist.create( table, sans_album ).then( function( data ) {
		callback( null, response.success( sans_album )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//get an album
exports.get = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const table = 'sans-albums' ;
	var sans_album = {} ;
	sans_album.sub = sub ;

	console.log( JSON.stringify( event ) ) ;
	/*
	persist.get( table, folder ).then( function( data ) {
		console.log( response.success( data ) ) ;
		callback( null, response.success( data )) ;
		return true ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
		return false ;
	}) ;
	*/
}

//delete existing album
exports.delete = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const table = 'sans-albums' ;
	const key = { userid: sub, album: event.pathParameters.albumid } ;

	persist.delete( table, key ).then( function( data ) {
		console.log( response.success( data ) ) ;
		callback( null, response.success( "deleted" )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//update album
exports.update = ( event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const body = JSON.parse( event.body ) ;
	const table = 'sans-albums' ;
	var sans_album = {} ;
	sans_album.userid      = body.userid ;
	sans_album.albumid     = body.albumid ;
	sans_album.title       = body.title ;
	sans_album.description = body.description ;
	sans_album.cover       = body.cover ;
	sans_album.images      = body.images ;
	sans_album.private     = body.private ;
	sans_album.createdAt   = body.createdAt ;
	
	persist.create( table, sans_album ).then( function( data ) {
		callback( null, response.success( sans_album )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//get all albums
exports.getAll = (event, context, callback) => {
	
	const quyen      = '832bb986-871d-4bd2-a832-9e7134265604' ; // hard coded for now
	const table      = 'sans-albums' ;
	const expression = "userid = :u" ;
	const values     = { ":u": quyen } ;

	console.log( table, expression, values ) ;

	persist.read(table, expression, values ).then( function ( albums ) { 
		callback( null, response.success( albums.Items )) ;
	}). catch( function( error) {
		console.log( "Failed to read albums " + error ) ;
		callback( null, response.failure( "Could not get albums" ) ) ;
	});
} ;