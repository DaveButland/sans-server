const AWS = require('aws-sdk');
const config = require('./config') ;
 
exports.handler = (event, context, callback) => {
    AWS.config.update({
        region: "eu-west-2"
    });

		const s3 = new AWS.S3({signatureVersion: 'v4', signatureCache: false, accessKeyId: config.keys.accessKeyId, secretAccessKey: config.keys.secretAccessKey});
		
    var request = event["queryStringParameters"]["request"];
    var key = event["queryStringParameters"]["key"];
    var bucket = event["queryStringParameters"]["bucket"];

    if ( request == null ) { request = "getObject" ; }    
    if ( bucket == null ) { bucket = "private.sans-caffeine.com" ; }

    s3.getSignedUrl(request, {
        Bucket: bucket,
        Key: key,
        Expires: 7200
    }, function(error, data){
        if(error) {
            context.done(error);
        }else{
            var response = {
                statusCode: 200, //301 redirect issues with CORS?
                headers: {
                    "Location" : data,
                    "Access-Control-Allow-Origin": '*',
                    "Access-Control-Allow-Credentials": true
               },
                body: null
            };
            callback(null, response);
        }
    })
};