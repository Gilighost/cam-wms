/********************************************************************
 Define routes for WMS

 Exports: router
 ********************************************************************/

var express = require('express'),
	wmsRequestHandler = require('./controllers/wmsRequestHandler'),
	path = require('path');

var router = express.Router();

//handle WMS requests
router.get('/wms', wmsRequestHandler);

//next three routes are for test files
router.get('/test', function(req, res){
	res.sendFile(path.join(__dirname + '/../test_pages/getFeatureInfoTest.html'));
});

router.get('/slippymap', function(req, res){
	res.sendFile(path.join(__dirname + '/../test_pages/slippymap.html'));
});

router.get('/instamap', function(req, res){
	res.sendFile(path.join(__dirname + '/../test_pages/instamap.html'));
});

// Export
module.exports = router;
