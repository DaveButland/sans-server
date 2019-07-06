const AWS = require('aws-sdk');
const sharp = require('sharp') ;
const config = require('./config') ;

AWS.config.update({
	region: config.region
});

const s3 = new AWS.S3({signatureVersion: 'v4', signatureCache: false, accessKeyId: config.keys.accessKeyId, secretAccessKey: config.keys.secretAccessKey});

exports.createThumbnail = function (image, params ) {

	var bucket   = "private.sans-website.com"
	var key      = "private/" + image.folderId + "/" + image.imageId ;
	var thumbkey = "private/" + image.folderId + "/" + image.thumbNail ;

	var s3GetParams = {  Bucket: bucket, Key: key } ;
	
	s3.getObject( s3GetParams, function(err, data) {
		if (err) { 
			console.log(err, err.stack); 
		} 
		else {
	
			const { Body, ContentType } = data
			const imageData = new Buffer.from(Body)
			const tasks = { width: 300 } ;
	
			sharp(imageData).resize(tasks).toBuffer().then(function(newFileInfo) {
					
				var s3PutParams = {  Bucket: bucket, Key: thumbkey, ContentType, Body: newFileInfo } ;
	
				s3.putObject( s3PutParams, function( err, data) {
					if (err) { 
						console.log(err, err.stack); 
					} 
					else {
						console.log( "completed" ) ; 
					}
				}) ;
			})
			.catch(function(err) {
				console.log("Error occured", err);
			});
		}
	});
}

