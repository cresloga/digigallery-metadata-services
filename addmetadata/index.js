var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.DB_REGION,
  endpoint: process.env.DB_ENDPOINT
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context,callback) {
    console.log("Event Received : "+JSON.stringify(event));    
    var table = process.env.DB_TABLE_NAME;
    var fileName = event.body.fileName;
    var labels =  event.body.Labels;

    var params = {
        TableName:table,
        Item:{
            fileName: fileName,
            labels: labels
        }
    };

    console.log("Adding a new item");
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, err);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            callback(null, data);
        }
    });
}