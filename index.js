const express = require('express');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');

const app = express();  
const port = 3000;

//Middleware
app.use(fileUpload());

AWS.config.loadFromPath('./config/credentials.json');

const rekognition = new AWS.Rekognition(); 

/* This operation detects labels in the supplied image */

const detectImage = (image, callback) => {
  var params = {
    Image: {
     Bytes: image.data.buffer
    }, 
    MaxLabels: 20, 
    MinConfidence: 70
   };
   rekognition.detectLabels(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else {
       const mapResult = data.Labels.map(function (el){
         return el.Name;
       })
       callback(mapResult);
    } // Successful
   });
}

   app.use(express.static('public'))

   // Controller
   app.post('/upload', function(req, res) {

    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + sampleFile.name;
    detectImage(sampleFile, function(response){
      console.log(response);
      res.send(response);
    })
  });

  app.listen(port, () => {
    console.log(`App listening to Port ${port}`)
  });