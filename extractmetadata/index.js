const aws = require('aws-sdk');
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

aws.config.region = process.env.S3_REGION;

var sns = new aws.SNS();

exports.handler = function(event, context, callback) {
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
		let message = {
			fileName: params.Image.S3Object.Name,
			Labels: data.Labels
		};
		postMessage(message);
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

function postMessage(message) {
	var params = {
        Message: JSON.stringify(message),
        TopicArn: SNS_TOPIC_ARN
    };
	sns.publish(params, function(err, data) {
        if (err) {
            console.log(err.stack);
            return;
        }
        console.log('Published to Topic');
        console.log(data);
    });
}