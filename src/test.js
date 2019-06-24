//const AWS      = require('aws-sdk');
//const persist  = require('./persist');

/*
AWS.config.update({
	region: "eu-west-2", 
	accessKeyId: "AKIA2YK4SJRTOZRYQZV4",
	secretAccessKey: "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"
});
*/

const table = 'folders' ;
let key = { userId: 'sirebel', folderId: 'test'} ;

const record = { userId: 'sirebel'
	, folderId: 'test'
	, folderName: 'goodbye'
	, createdAt: Date.now() 
	} ;

	const test = 'this is a test of the strip function' ;
	console.log( test.strip(7) ) ;



//persist.create(table, record);

//persist.delete( table, key ) ;
/*
expression = "userId = :u" ;
values = {":u": "27a41a02-9f47-4476-9095-891d3c89f939" } ;

persist.read(table, expression, values ).then( function ( data ) { 
		console.log("Query succeeded.");
		data.Items.forEach(function(item) {
				console.log( JSON.stringify( item ) ) ;
		});
});

/*.then( 
		console.log( folders ) 
  ).catch( e =>
	console.log( e ) 
);
*/

