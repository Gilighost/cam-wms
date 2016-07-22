var sendXML = require('./sendXML');
var mapnik = require("mapnik");
var fs = require("fs");
var config = require('../../config');
var colors = require('colors')
var WMSlayers = require(config.layers)
var errorMessageBuilder = require('./errorMessageBuilder')

mapnik.registerFonts(config.fontDirectory, {recurse: true});
mapnik.register_default_input_plugins();

function handleGetMapRequest(req, res){	
    validateRequest(req, function(err, mapReq){
        if(err){
            console.log(err)
            sendXML(res, errorMessageBuilder.buildServiceExceptionReportForMissingParams(err));
        }
        else{
        	createMap(mapReq, function(err, mapImg){
                res.set('content-type', 'image/' + mapReq.imgFormat)
                res.send(mapImg)
            });
        }
    });
}
module.exports = handleGetMapRequest;

function createMap(mapReq, callback){
    var map = new mapnik.Map(mapReq.imgWidth, mapReq.imgHeight);
    map.loadSync(config.styles)
    map.srs = '+init=' + mapReq.srs;

    for(var index in mapReq.layers){
        var layerName =  mapReq.layers[index];
        if(WMSlayers.hasOwnProperty(layerName)){
            map.add_layer(createMapLayer(layerName, ''));
        }
        else{
            callback('LayerNotDefined')
        }
    }
    map.zoomAll();

    var im = new mapnik.Image(mapReq.imgWidth, mapReq.imgHeight);
    map.render(im, function(err,im) {
        if (err) throw err;
        im.encode(mapReq.imgFormat, function(err, buffer) {
            if (err) throw err;
            callback(undefined, buffer);
         });
    });
}

function createMapLayer(name, style){
    var layerOptions = WMSlayers[name];
    var mapLayer = new mapnik.Layer(layerOptions.name, layerOptions.srs);
    mapLayer.styles = [(style == '') ? layerOptions.defaultStyle : style ];
    mapLayer.datasource = new mapnik.Datasource(layerOptions.datasource);
    return mapLayer;
}

function validateRequest(req, callback){
    var mapReqObj = {}
    var missingParams = []
    try{
        mapReqObj.layers = req.query.layers.split(',');
    }
    catch(err){
        missingParams.push('LAYERS')
    }
    try{
        mapReqObj.styles = req.query.styles.split(',');
    }
    catch(err) {
        missingParams.push('STYLES')
    }
    try{
        mapReqObj.imgFormat = req.query.format.toString();
    }
    catch(err) {
        missingParams.push('FORMAT')
    }
    try{
        mapReqObj.imgHeight = parseInt(req.query.height);
    }
    catch(err) {
        missingParams.push('HEIGHT')
    }
    try{
        mapReqObj.imgWidth = parseInt(req.query.width);
    }
    catch(err) {
        missingParams.push('WIDTH')
    }
    try{
        mapReqObj.bbox = req.query.bbox.split(',');
    }
    catch(err) {
        missingParams.push('BBOX')
    }
    try{
        mapReqObj.version = req.query.version.toString();
    }
    catch(err) {
        missingParams.push('VERSION')
    }
    try{
        mapReqObj.srs =  req.query.srs.toString() || req.query.crs.toString();
    }
    catch(err) {
        missingParams.push('SRS')
    }

    callback((missingParams.length == 0 ? undefined : missingParams) , mapReqObj);
}