const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config/credentials.json');

const rekognition = new AWS.Rekognition(); 

/* This operation detects labels in the supplied image */

var params = {
    Image: {
     S3Object: {
      Bucket: "rekognition-demo-bucket-turners", 
      Name: "41.jpg"
     }
    }, 
    MaxLabels: 12, 
    MinConfidence: 70
   };
   rekognition.detectLabels(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
   });