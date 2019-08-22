const uuid     = require('uuid');
const persist  = require('./persist');
const validateJWT = require('./validateJWT');
const response = require('./response');

//create a new message
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
	const table = 'sans-messages' ;
	var message = {} ;
	message.userid    = sub ;
	message.messageid = uuid.v4() ;
	message.name      = body.name ;
	message.subject   = body.subject ;
	message.start     = body.start ;
	message.end       = body.end ; //calculated
	message.duration  = body.duration ;
	message.type      = body.type ;
	message.location  = body.location ;
	message.portfolio = body.portfolio ;
	message.email     = body.email ;
	message.content   = body.content ;
	message.createdAt = Date.now() ;
	
	persist.create( table, message ).then( function( data ) {
		callback( null, response.success( message )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//get a message
exports.get = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const table = 'sans-message' ;
	var folder = {} ;
	folder.sub = sub ;

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

//delete existing message
exports.delete = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const table = 'sans-messages' ;
	const key = { userid: sub, messageid: event.pathParameters.messageid } ;

	persist.delete( table, key ).then( function( data ) {
		console.log( response.success( data ) ) ;
		callback( null, response.success( "deleted" )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//update message
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
	const table = 'sans-messages' ;
	var message = {} ;
	message.userid    = sub ;
	message.messageid = body.messageid ;
	message.name      = body.name ;
	message.subject   = body.subject ;
	message.start     = body.start ;
	message.end       = body.end ; //calculated
	message.duration  = body.duration ;
	message.type      = body.type ;
	message.location  = body.location ;
	message.portfolio = body.portfolio ;
	message.email     = body.email ;
	message.content   = body.content ;
	message.createdAt = Date.now() ;
	
	persist.create( table, message ).then( function( data ) {
		callback( null, response.success( message )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//get all messages
exports.getAll = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( "Missing or Invalid Authorization Token");
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;
	const table = 'sans-messages' ;
	const expression = "userid = :u" ;
	const values = { ":u": sub } ;

	console.log( table, expression, values ) ;

	persist.read(table, expression, values ).then( function ( messages ) { 
		callback( null, response.success( messages.Items )) ;
	}). catch( function( error) {
		console.log( "Failed to read folders " + error ) ;
		callback( null, response.failure( "Could not get pages" ) ) ;
	});
} ;