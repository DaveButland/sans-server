var jsonwebtoken = require('jsonwebtoken');  
var jwkToPem = require('jwk-to-pem');

var USERPOOLID = 'eu-west-2_Jnf5VZPOH';
var JWKS = '{"keys":[{"alg":"RS256","e":"AQAB","kid":"gc8TgIBcI6FOAC+42dw5W158ySMgM2HxYJ0HndX6r1A=","kty":"RSA","n":"l5Ub_LLWvg9KNWRKuICuzgBJ3Eid_gfQznp0xBV2PyA9A94fV51ZSS63bot-U2oxwHB7AdWwqUh38F7e-gaShW2YGWjCwRteZpSxdFI4IhsBbJOaxG09RMH1xQ41mXKwZdoHeI7ZOs-ZrFc9LHk1kmqEKgLaatYumkdhg6dCWHtGO8snDtE3zDDHjYtYm6j-yaI5PC7fTVF26Oq6wvoGBu8AQWT-WXg8nLJXkcXGAv1yp_Z1ppbjRaLP97-_sDb7JTXzQGws6a_VE1aWhWkFwnne08kVguz_TM0NVBTHyRNS8Pb2-c1sYR2-JLuwC1N961JyX9RlpLcmSVyfnZSADQ","use":"sig"},{"alg":"RS256","e":"AQAB","kid":"xTnbyMyhl1tFV90chjpMp8wHu9cAB+TU8ZXbr1WNu2A=","kty":"RSA","n":"vfpYyiqFa4IUZnzd3zqyrN2VGj7U8aZI0zQNirRcG-crlrvYioIG7JGylWOJRtiyIsiJMbMCo4C74lukI0gIXDZ6M4rUZqpBgs4X90GeAwR5Ov21zcl0--VgK0iA0djifiEuwCr1DRSoDGkWbaGcmNXu73iVp8Awq0765H_M40iO8arlsp56p_3ZV4FBU00KqvM_3DWWhjBF24ehZI5eoa959bHgDLjjz77PGUCZ6XTD11qe_Bs1ximu3zN2Z0ZhVLDZK2cjdfKnx_VCURDUPYEXhKirO0cI49WBnaOI9deM2OtE9CMmchMgYoWNp_n3tYYpLWVaQHIVcr4U8Wcylw","use":"sig"}]}' ;

var region = 'eu-west-2';
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