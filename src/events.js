const uuid     = require('uuid');
const persist  = require('./persist');
const validateJWT = require('./validateJWT');
const response = require('./response');

//create a new event
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
	const table = 'sans-events' ;
	var sans_event = {} ;
	sans_event.userId = sub ;
	sans_event.pageId  = uuid.v4() ;
	sans_event.name = body.name ;
	sans_event.createdAt = Date.now() ;
	
	persist.create( table, sans_event ).then( function( data ) {
		callback( null, response.success( sans_event )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//get an event
exports.get = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const table = 'sans-events' ;
	var sans_event = {} ;
	sans_event.sub = sub ;

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

//delete existing event
exports.delete = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( { errorMessage: "Missing or Invalid Authorization Token" } );
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

	if ( !sub ) {
		callback( null, response.failure( { errorMessages: "Invalid Token"} ) ) ;
		return false ;
	}
	
	const table = 'sans-events' ;
	const key = { userId: sub, eventId: event.pathParameters.eventid } ;

	persist.delete( table, key ).then( function( data ) {
		console.log( response.success( data ) ) ;
		callback( null, response.success( "deleted" )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//update event
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
	const table = 'sans-events' ;
	var sans_event = {} ;
	sans_event.userId    = body.userId ;
	sans_event.eventId   = body.eventId ;
	sans_event.start     = body.start ;
	sans_event.title     = body.title ;
	sans_event.createdAt = body.createdAt ;
	
	persist.create( table, sans_event ).then( function( data ) {
		callback( null, response.success( page )) ;
	}).catch ( function (error ) {
		console.log( "error=" + error) ;
		callback( null, response.failure({ status: false }) );
	}) ;
}

//get all pages
exports.getAll = (event, context, callback) => {
	
	if ( ( !event.headers.Authorization ) || ( !event.headers.Authorization.startsWith("Bearer ") ) ) {
		return response.invalid( "Missing or Invalid Authorization Token");
	}

	const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;
	const table = 'sans-events' ;
	const expression = "userId = :u" ;
	const values = { ":u": sub } ;

	console.log( table, expression, values ) ;

	persist.read(table, expression, values ).then( function ( sans_events ) { 
		callback( null, response.success( sans_events.Items )) ;
	}). catch( function( error) {
		console.log( "Failed to read events " + error ) ;
		callback( null, response.failure( "Could not get events" ) ) ;
	});
} ;