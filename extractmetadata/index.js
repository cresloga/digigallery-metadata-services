const aws = require('aws-sdk');
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.handler = function(event, context,callback) {
    console.log("Event Received : "+JSON.stringify(event)); 
	var fileName, bucketName;
    if(event.Records[0]!=null) {
		fileName = event.Records[0].s3.object.key;
		bucketName = event.Records[0].s3.bucket.name;
	}
        
	var params = {
	  Image: {
	   S3Object: {
	    Bucket: bucketName, 
	    Name: fileName
	   }
	  }, 
	  MaxLabels: 5, 
	  MinConfidence: 70
	 };
	getRekognitionLabels(params).then( function(data){
		console.log(data);
		callback(null,JSON.parse(JSON.stringify(data,null,2)));
	}, function(error){
		console.log(error, error.stack); // an error occurred
	   	callback(null, JSON.parse(JSON.stringify(error,null,2)));
	});
}

function getRekognitionLabels(params,callback){
	console.log("calling Rekognition with params : "+params);
	return new Promise((resolve, reject) => {
		var rekognition = new aws.Rekognition();
		rekognition.detectLabels(params, function(err, data) {
		if (err){
			reject(err);
		} 
		else                // successful response
		{
			resolve(data);    
		}
		});
	});
	
}