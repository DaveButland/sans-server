const AWS = require("aws-sdk");

exports.create = function (table, record) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	const params = { 
		TableName: table,
		Item: record 
	}

	return dynamoDb.put(params).promise();
}

// slowly refactoring to get, put, update, delete, find etc
exports.put = function (table, record) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	const params = { 
		TableName: table,
		Item: record 
	}

	return dynamoDb.put(params).promise();
}

exports.get = function (table, key) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	const params = { 
		TableName: table,
		Key: key 
	}

	const test = dynamoDb.get(params).promise() ;

	return test ;
}

exports.get1 = function (table, key) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	const params = { 
		TableName: table,
		Key: key 
	}

	return dynamoDb.get(params, function( err, data ) {
		if (err) {
			console.log( "help" ) ;
		}
		else {
			console.log( data.Item ) ;
		}
	});

	docClient.query(params, function(err, data) {
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item.year + ": " + item.title
            + " ... " + item.info.genres
            + " ... " + item.info.actors[0]);
        });
    }
});

}

exports.read = function (table, expression, values ) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	const params = { 
		TableName: table,
		KeyConditionExpression: expression,
		ExpressionAttributeValues: values
	} ;

//	return dynamoDb.query( params ).promise() ;

	return dynamoDb.query( params ).promise() ;
 /*
	dynamoDb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log( JSON.stringify( item ) ) ;
        });
    }
	});
	*/
}

exports.readIndex = function (table, index, expression, values ) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	const params = { 
		TableName: table,
		IndexName: index,
		KeyConditionExpression: expression,
		ExpressionAttributeValues: values
	} ;

//	return dynamoDb.query( params ).promise() ;

	return dynamoDb.query( params ).promise() ;
 /*
	dynamoDb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log( JSON.stringify( item ) ) ;
        });
    }
	});
	*/
}

exports.update = function (table, record) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	const params = { TableName: table, Item: record };

	return dynamoDb.update(params).promise();
}

exports.delete = function (table, key) {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	const params = {
		TableName: table,
		Key: key,
	}

	return dynamoDb.delete(params).promise();
}