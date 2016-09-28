/********************************************************************
 Define routes for WMS

 Exports: router
 ********************************************************************/

var express = require('express'),
    config = require('../config'),
    wmsRequestHandler = require('./controllers/wmsRequestHandler'),
    path = require('path');

var router = express.Router();

router.get('/wms', wmsRequestHandler);

router.get('/testfile', function(req, res){
	res.sendFile(path.join(__dirname + '/../test_pages/getFeatureInfoTest.html'));
});

router.get('/', function(req, res){res.send("ERROR: 404")});

// Export
module.exports = router;
