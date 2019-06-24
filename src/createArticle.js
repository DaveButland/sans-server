const AWS = require('aws-sdk');
const uuid = require('uuid');

function persist(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}

function success(body) {
  return buildResponse(200, body);
}

function failure(body) {
  return buildResponse(500, body);
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  
  console.log( event ) ;
  console.log( event.body ) ;
  const data = JSON.parse(event.body);
  let userId = event.requestContext.identity.cognitoIdentityId
  console.log( "userid: " + userId ) ;
  if ( userId == null )
  {
    userId = "sirebel"
  }
	
	const params = {
    TableName: "articles",
    Item: {
			userId: userId,
			articleId: uuid.v1(),
			content: data,
	    createdAt: Date.now()
    }
  };
  
  console.log( params ) ;
	
	try {
    await persist('put', params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
	}
};