var sendXML = require('./sendXML');
var mapnik = require("mapnik");
var fs = require("fs");
var config = require('../../config');
var colors = require('colors')

mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

function handleGetMapRequest(req, res){	

	var styles = req.query.styles.split(',');
	var imgFormat = req.query.format;
	var imgHeight = parseInt(req.query.height);
	var imgWidth = parseInt(req.query.width);
	var bbox = req.query.bbox.split(',');
	//var version = ?
	//var CRS = ?
	var layers = req.query.layers.split(',')

	var map = new mapnik.Map(imgWidth, imgHeight);
	var map2 = new mapnik.Map(imgWidth, imgHeight);
	map2.loadSync(config.styleDir + 'world_merc/default.xml')

	map.load(config.styleDir + layers[0] + '/' + styles[0] +".xml", function(err,map) {
	    if (err) throw err;
	    map.zoomAll();
	    //map.extent = bbox;
	    map.add_layer(map2.get_layer(0));
	    console.log(map.layers())
	    var im = new mapnik.Image(imgWidth, imgHeight);
	    map.render(im, function(err,im) {
	        if (err) throw err;
	        im.encode(imgFormat, function(err,buffer) {
	            if (err) throw err;

	            res.set('content-type', 'image/' + imgFormat)
	            res.send(buffer)
	         });
	    });
	});
}

module.exports = handleGetMapRequest;