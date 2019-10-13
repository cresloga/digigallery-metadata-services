const DynamoDB = require('aws-sdk/clients/dynamodb');

var connConfig = {
  region: process.env.DB_REGION,
  endpoint: process.env.DB_ENDPOINT
};

var docClient = new DynamoDB(connConfig).DocumentClient();


exports.handler = function(event, context,callback) {
    console.log("Event Received : "+JSON.stringify(event));

    var table = process.env.DB_TABLE_NAME;
    var fileName = event.body.fileName;    
    var params = {
        TableName:table,
        Key:{
            fileName: fileName
        }
    };
    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, err);
        } else {
            console.log("Read item:", JSON.stringify(data, null, 2));
            callback(null, data);
        }
    });
}