const express = require('express');
const cors = require('cors');
const request = require("request");
const azurecred = require('./config/credentialsazure.json')

const app = express();  
const port = 5000;

//Middleware
app.use(cors({
  origin: true,
  methods:["GET", "POST"],
  credentials: true
}));


var subscriptionKey = azurecred.subscriptionKey;
var customConfigId = azurecred.customConfigId;



app.get('/search', function (req, res) {
    
    var searchTerm = req.query.query;

    var info = {
        url: 'https://api.bing.microsoft.com/v7.0/custom/search?' + 
            'q=' + searchTerm + "&" +
            'customconfig=' + customConfigId,
        headers: {
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    };

    request(info, function(error, response, body){
        var searchResponse = JSON.parse(body);
        if(!searchResponse.hasOwnProperty('webPages')){
            res.send('No search results');
            console.log('NO results');
        } else {
            var finalResponse = searchResponse.webPages.value;
            res.send(finalResponse);
        }
    });
})


app.listen(port, () => {
    console.log(`App listening to Port ${port}`)
});