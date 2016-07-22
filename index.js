/********************************************************************
 Main:  run express application
 ********************************************************************/
var colors = require('colors');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = require('./app'),
    config = require('./config');

console.log(("Listening on port " + config.port + "...").rainbow);
app.listen(config.port);
