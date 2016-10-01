/********************************************************************
 Create and initialize express application

 Exports: application
 ********************************************************************/
var config   = require('../config'),
    express  = require('express'),
    morgan   = require('morgan'),
    parser   = require('body-parser'),
    session  = require('express-session');

// Create application
var app = express();

// Parse POST requests
app.use(parser.urlencoded({ extended: false }));

// Logging
app.use(morgan(config.logLevel));

// Routes
app.use('/', require('./routes'));

//for test files & their resources
app.use(express.static('./test_pages'));

// For everything else
app.use(function(req, res, next) {
  res.status(404).send("ERROR: 404");
});

// Export app
module.exports = app;
