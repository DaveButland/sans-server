const AWS = require('aws-sdk');
const fs = require("fs");
const config = require("./config");

const default_domain = 'localhost' ;

exports.getImageCookies = ( images, domain, callback ) => {

  let keyPairId = config.keyPairId ;

  fs.readFile("./src/pk-"+keyPairId+".pem", function (err, data) {
    if (err) throw err;
		
		let privateKey = data ;
    let signer = new AWS.CloudFront.Signer(keyPairId, privateKey);
    let cfUrl = domain ;
       
    let expiry = Date.now() + 60 * 60 ;

		const imagePolicies = images.map( image => {
      var imagePolicy = { 'Resource': 'https://'+domain+'/private/'+image.folderId+'/'+image.imageId
										, 'Condition': { 'DateLessThan': {'AWS:EpochTime': expiry} }
										} 
			return imagePolicy ;
		}) ;

//		let policy = { 'Statement': [ imagePolicies ] } ;
     
    let policy = {
        'Statement': [{
            'Resource': 'https://'+domain+'/private/'+images[0].folderId+'/*',
            'Condition': {
                'DateLessThan': {'AWS:EpochTime': expiry}
            }
        }]
    };
   let policyString = JSON.stringify(policy);

		var options = {url: "https://"+cfUrl, policy: policyString};
		
    signer.getSignedCookie( options, function( err, cookie ) {
      if ( err ) {
        console.log( err ) ;
        const response = {
        	statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Credentials": true
          },
        	body: { "error": err }
        }
        callback(null, response);
      } else {
        const response = cookie ; 
        callback(null, response);
      }
    });
  }); 

  return 'ouch' ;
}

exports.get = (event, context, callback) => {

  let keyPairId = config.keyPairId ;

  fs.readFile("./src/pk-"+keyPairId+".pem", function (err, data) {
    if (err) throw err;
      let privateKey = data ;
        
    let domain = event["queryStringParameters"]["domain"];
    
    if ( domain == null ) { domain = default_domain ; } 

    let cfUrl = domain ;
    let expiry = Date.now() + 60 * 60 ;

//            'Resource': 'http*://' + cfUrl + '/private/*',

    let policy = {
        'Statement': [{
					'Resource': 'https://'+domain+'/private/b79d8427-8919-4e66-8af7-c0597702a812/*',
					'Condition': {
                'DateLessThan': {'AWS:EpochTime': expiry}
            }
        }]
    };

    let policyString = JSON.stringify(policy);

    let signer = new AWS.CloudFront.Signer(keyPairId, privateKey);

    var options = {url: "https://"+cfUrl, policy: policyString};
    signer.getSignedCookie( options, function( err, cookie ) {
      if ( err ) {
        console.log( err ) ;
        const response = {
        	statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Credentials": true
          },
        	body: { "error": err }
        }
        callback(null, response);
      } else {
				let cookie1 = 'CloudFront-Key-Pair-Id=' + cookie["CloudFront-Key-Pair-Id"] + ';domain='+domain+'; ' ;
				let cookie2 = 'CloudFront-Policy=' + cookie["CloudFront-Policy"] + ';domain='+domain+'; ' ;
				let cookie3 = 'CloudFront-Signature' + cookie["CloudFront-Signature"] + ';domain='+domain+'; ';
            
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Credentials": true,
						"Set-Cookie": cookie1,
						"set-Cookie": cookie2,
						"set-cookie": cookie3
          },
          body: JSON.stringify( cookie ) 
        }
        callback(null, response);
      }
    });
  }); 

  return 'ouch' ;
}
