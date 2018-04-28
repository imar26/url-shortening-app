var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var redis = require("redis");
var client = redis.createClient();
//Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'src')));
//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

require('./private/app')(app, client);

var server = app.listen(3000, function () {
    console.log('Application server running on port 3000');
});