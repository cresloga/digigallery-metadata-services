const aws = require('aws-sdk');
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.handler = function(event, context,callback) {
    console.log("Event Received : "+JSON.stringify(event)); 
	console.log("SQS URL : "+SQS_QUEUE_URL); 	
	var fileName = event.body.fileName;
	console.log("File Name :"+fileName);
	var params = {
	  Image: {
	   S3Object: {
	    Bucket: S3_BUCKET, 
	    Name: fileName
	   }
	  }, 
	  MaxLabels: 5, 
	  MinConfidence: 70
	 };
	getRekognitionLabels(params,callback);
}

function getRekognitionLabels(params,callback){
	console.log("calling Rekognition");
	var rekognition = new aws.Rekognition(awsApiUser);
	 rekognition.detectLabels(params, function(err, data) {
	   if (err){
	   	console.log(err, err.stack); // an error occurred
	   	callback(null, JSON.parse(JSON.stringify(err,null,2))); 
	   } 
	   else                // successful response
	   {
	   		//var resData = JSON.parse(data);
	   		//console.log("\n\n\n"+data.Labels.length);
	   		console.log(data);
	   		callback(null,JSON.parse(JSON.stringify(data,null,2)));           
	   }
	 });
}






