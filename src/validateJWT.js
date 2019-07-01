var jsonwebtoken = require('jsonwebtoken');  
var jwkToPem = require('jwk-to-pem');
const config = require('./config') ;

var USERPOOLID = config.USERPOOLID ;
var JWKS = config.JWKS ;
var region = config.region ;

var iss = 'https://cognito-idp.' + region + '.amazonaws.com/' + USERPOOLID;
var pems;

pems = {};
var keys = JSON.parse(JWKS).keys;
for(var i = 0; i < keys.length; i++) {
    //Convert each key to PEM
    var key_id = keys[i].kid;
    var modulus = keys[i].n;
    var exponent = keys[i].e;
    var key_type = keys[i].kty;
    var jwk = { kty: key_type, n: modulus, e: exponent};
    var pem = jwkToPem(jwk);
    pems[key_id] = pem;
}

function decode( jwtToken ) {

	var jwt = jsonwebtoken.decode(jwtToken, {complete: true});
	if (!jwt) {
			console.log("Not a valid JWT token");
			return false;
	}

	return jwt ;
} 

function checkIssuer( jwt ) { 
	if (jwt.payload.iss != iss) {
		console.log('invalid issuer');
		return false;
	}
	return true;
}

function checkPEM( jwt ) {
	var kid = jwt.header.kid;
	var pem = pems[kid];
	if (!pem) {
			console.log('Invalid access token');
			return false;
	}
	return true;
}

function checkAccess( jwt ) {
	if (jwt.payload.token_use != 'access') {
		console.log('Not an access token');
		return false;
	}
	return true ;
}

function checkToken( jwtToken ) {
	var payload = jsonwebtoken.verify(jwtToken, pem, { issuer: iss }, function(err, payload) {
		if(err) {
			console.log( err ) ;
			console.log('Token failed verification');
			return false;
		} else {
			console.log( payload ) ;
			console.log('Successful verification');			
			return payload ;
		}
	});
	
	return payload ;
}

exports.getSub = function ( jwtToken ) {
	var payload = checkToken( jwtToken ) ;

	if ( payload ) {
		return payload.sub ;
	} else {
		return false ;
	}

/*	
	var jwt = decode( jwtToken ) ;
	if ( checkIssuer( jwt ) && checkPEM( jwt ) && checkAccess( jwt ) && checkToken( jwtToken ) ) {
		return jwt.payload.sub ;
	}
	else {
		return false ;
	}
	*/
} ;