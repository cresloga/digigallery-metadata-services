var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));

AWS.config.update({
  region: process.env.DB_REGION,
  endpoint: process.env.DB_ENDPOINT
});

var docClient = AWSXRay.captureAWSClient(new AWS.DynamoDB());


exports.handler = function(event, context,callback) {
    console.log("Event Received : "+JSON.stringify(event));

    var table = process.env.DB_TABLE_NAME;
    var fileName = event.pathParameters.fileName;    
    var params = {
        TableName:table,
        Key:{
            fileName: fileName
        }
    };

    var responseBody = {};  
	var responseStatus = 200;
    var responseContentType = "application/json";
    
    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            responseBody = err;
            responseStatus = 417;
        } else {
            console.log("Read item:", JSON.stringify(data, null, 2));
            responseBody = data;            
        }
        respond(responseStatus, responseContentType, responseBody, callback);
    });
}

function respond(responseStatus, responseContentType, responseBody, callback){
	var response = {
		"statusCode": responseStatus,
		"headers": {
			"Content-Type": responseContentType
		},
		"body": JSON.stringify(responseBody),
		"isBase64Encoded": false
	}
	console.log(response);
	callback(null,response);
}