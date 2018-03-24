const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const yelp = require('yelp-fusion');
const app = express();

//Load Keys file
const keys = require('./config.js');
const apiKey = keys.api_key;
const client = yelp.client(apiKey);

//Cross Browser compatiability 
app.use(cors());

//Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Path middleware
app.use(express.static(path.join(__dirname, "..", "client")));

app.get('*', (req, res) => {
    res.send(express.static(path.join(__dirname, "..", "client", "index.html")));
});

app.get('/yelprequest', (req, res) => {
    console.log('req.query: ', req.query);
    const searchRequest = {
        term: req.query.term,
        'latitude': req.query.latitude,
        'longitude': req.query.longitude,
        'radius': req.query.radius
    };
    client.search(searchRequest).then(response => {
        const firstResult = response.jsonBody.businesses;
        const prettyJson = JSON.stringify(firstResult, null, 4);
        res.send(prettyJson);
    }).catch(e => {
        console.log(e);
    });
})

//Port depending on where it is listening
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server connected on ' + port);
});