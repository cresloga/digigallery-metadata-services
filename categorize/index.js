var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.DB_REGION,
  endpoint: process.env.DB_ENDPOINT
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context,callback) {
    console.log("Event Received : "+JSON.stringify(event));    
    var table = process.env.DB_TABLE_NAME;
    var requestPayload = JSON.parse(event.Records[0].Sns.Message);
    var fileName = requestPayload.fileName;
    var labels =  requestPayload.Labels;

    for(var i=0; i<labels.length; i++) {
        
        var label = labels[i].Name;
        var formattedLabel = label.toLowerCase().trim();

        if (labels[i].Confidence > 99 && !categoryId) {
            switch(formattedLabel) {
                case "restaurant":
                case "cafeteria":
                case "food court":	   			
                case "breakfast":	
                case "food":
                case "pizza":
                    categoryName = "Kitchen";
                    categoryId = "284507";
                    break;  					
                case "cake":
                case "birthday cake":
                    categoryName = "Toys & Games";
                    categoryId = "165793011";
                    break;			   					
                
                case "sari":
                    categoryName = "Women's Fashion";
                    categoryId = "7147440011";
                    break;
                case "costume":
                case "clothing":
                case "jeans":
                case "pant":
                    categoryName = "Men's Fashion";
                    categoryId = "7147441011";
                    break;
                case "man":
                case "men":
                    categoryName = "Men's Fashion";
                    categoryId = "7147441011";
                    break;
                case "boy":
                case "boys":
                    categoryName = "Boys’ Fashion";
                    categoryId = "7147443011";
                    break;
                case "motorcycle":
                case "vehicle":
                    categoryName = "Automotive & Motorcycle";
                    categoryId = "15684181";
                    break;
                case "billiard room":
                case "bowling":
                    categoryName = "Sports & Outdoors";
                    categoryId = "3375251";
                    break;
                case "mountain":
                case "outdoors":
                case "valley":
                case "shrine":
                case "architecture":
                case "monastery":
                case "beach":
                case "coast":
                    categoryName = "Luggage Travel Gear";
                    categoryId = "9479199011";
                    break;	   	
                case "musical instrument":
                case "musician":
                case "guitar":		
                    categoryName = "Musical Instruments";
                    categoryId = "11091801";
                    break;
            }
        }       
        console.log("Label : "+formattedLabel+", Category: "+categoryName);
    }

    var params = {
        TableName:table,
        Item:{
            fileName: fileName,
            category: [{
                "name": categoryName,
                "id": categoryId
            }]
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