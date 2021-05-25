const express = require('express');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');

const app = express();  
const port = 5000;

//Middleware
app.use(cors({
  origin: true,
  methods:["GET", "POST"],
  credentials: true
}));

app.use(fileUpload());

AWS.config.loadFromPath('./config/credentials.json');

const rekognition = new AWS.Rekognition(); 

const detectImage = (image, callback) => {
  var params = {
    Image: { 
      Bytes: Buffer.from(image.file.data),
    },
    ProjectVersionArn: "arn:aws:rekognition:ap-southeast-2:113539865244:project/Amazon-Rekognition-Project/version/Amazon-Rekognition-Project.2021-05-24T15.42.53/1621827827086",
    MaxResults: 15,
    MinConfidence: 70
  };
  rekognition.detectCustomLabels(params, function(err, data) {
      if (err){ // an error occurred
        callback(err);
        console.log(err);
      } 
      else callback(data.CustomLabels); // Successful 
  });
}
   // Controller
   app.post('/upload', function(req, res) {
    let image;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    image = req.files;
    detectImage(image, function(response){
      res.status(200).send(response);
    })
  });

  app.listen(port, () => {
    console.log(`App listening to Port ${port}`)
  });