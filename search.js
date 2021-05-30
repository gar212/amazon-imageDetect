const express = require('express');
const cors = require('cors');
const request = require("request");

const app = express();  
const port = 5000;

//Middleware
app.use(cors({
  origin: true,
  methods:["GET", "POST"],
  credentials: true
}));


var subscriptionKey = 'd698cd3c79c84cf4b0eaf4ab9d745f08';
var customConfigId = 'eae634c1-506f-4d79-bb53-1c177e0a3340';



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
        var finalResponse = searchResponse.webPages.value;
        res.send(finalResponse);
    });
})


app.listen(port, () => {
console.log(`App listening to Port ${port}`)
});