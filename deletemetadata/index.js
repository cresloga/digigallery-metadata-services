var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.DB_REGION,
  endpoint: process.env.DB_ENDPOINT
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {

    console.log("Event Received : "+JSON.stringify(event));

    var table = process.env.DB_TABLE_NAME;
    
    var fileName;
    if(event.Records[0]!=null)
        fileName = event.Records[0].s3.object.key;

    var params = {
        TableName:table,
        Key:{
            fileName: fileName
        }
    };
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, err);
        } else {
            console.log("deleted item:", JSON.stringify(data, null, 2));
            callback(null, data);
        }
    });
}