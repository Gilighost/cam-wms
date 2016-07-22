/********************************************************************
 Define routes for WMS

 Exports: router
 ********************************************************************/

var express = require('express'),
    config = require('../config'),
    wmsRequestHandler = require('./controllers/wmsRequestHandler');

var router = express.Router();

router.get('/wms', wmsRequestHandler);

router.get('/', function(req, res){res.send("ERROR: 404")});

// Export
module.exports = router;
