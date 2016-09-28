var mapnik = require("mapnik");
var fs = require("fs");
var config = require('../../config');
var colors = require('colors')
var WMSlayers = require(config.layers)
var errorMessageBuilder = require('./errorMessageBuilder')

mapnik.registerFonts(config.fontDirectory, {recurse: true});
mapnik.register_default_input_plugins();

//callback is passed error and map object
function createMap(mapReq, callback){
    var createMapError = undefined;
    var map = new mapnik.Map(mapReq.width, mapReq.height);
    map.loadSync(config.styles)
    map.srs = '+init=' + mapReq.srs;

    for(var index in mapReq.layers){
        var layerName =  mapReq.layers[index];
        if(WMSlayers.hasOwnProperty(layerName)){
            var layerToAdd = createMapLayer(layerName, mapReq.styles[index]);
            if(layerToAdd.styles.length > 0){
                map.add_layer(layerToAdd);
            }
            else{
                createMapError = 'StyleNotDefined'
                callback(createMapError);
                return;
            }
        }
        else{
            createMapError = 'LayerNotDefined'
            callback(createMapError);
            return;
        }
    }
    if(bboxIsValid(mapReq.bbox)){
        map.zoomToBox(mapReq.bbox);
    }
    else{ 
        createMapError = 'InvalidBBox'
        callback(createMapError);
        return;
    }
    callback(createMapError, map);
}

function createMapLayer(name, style){
    var layerOptions = WMSlayers[name];
    var mapLayer = new mapnik.Layer(layerOptions.name, layerOptions.srs);
    if(layerOptions.availableStyles.indexOf(style) > -1 || style == ''){
        mapLayer.styles = [(style == '') ? layerOptions.availableStyles[0] : style ];
    }
    mapLayer.datasource = new mapnik.Datasource(layerOptions.datasource);
    return mapLayer;
}

function createMapImage(mapReq, callback){    
    createMap(mapReq, function(createMapError, map){
        if(createMapError){
            callback(createMapError)
        }
        else{
            var im = new mapnik.Image(mapReq.width, mapReq.height);
            map.render(im, function(err,im) {
                if (err) throw err;

                mapReq.format = mapReq.format.replace('image/', '');

                im.encode(mapReq.format, function(err, buffer) {
                    if (err) createMapError = 'InvalidFormat';
                    callback(createMapError, buffer);
                 });
            });
        }
    })
}

//TODO: fully implement request options
function getFeatureInfo(mapReq, callback){
    createMap(mapReq, function(createMapError, map){
        if(createMapError){
            callback(createMapError);
        }
        else{            
            map.queryMapPoint(mapReq.i, mapReq.j, {layer: 0}, function(err, results) {
                if (err) throw err; //TODO: build xml error for this

                var fs = results[0].featureset; // assuming you're just grabbing the first object in the array
                var attributes = [];
                var feature;

                // grab all of the attributes and push to a temporary array
                while ((feature = fs.next())) {
                  attributes.push(feature.attributes());
                }
                callback(null, attributes);
            });
        }
    });
}

function bboxIsValid(bbox){
    if(bbox.length == 4){
        try{
            var xMin = parseFloat(bbox[0]);
            var yMin = parseFloat(bbox[1]);
            var xMax = parseFloat(bbox[2]);
            var yMax = parseFloat(bbox[3]);
        }
        catch(e){
            return false;
        }

        return (xMax > xMin && yMax > yMin);
    }
    else{
        return false;
    }
}

module.exports = {
	createMap: createMap,
	createMapLayer: createMapLayer,
    createMapImage: createMapImage,
	bboxIsValid: bboxIsValid,
    getFeatureInfo: getFeatureInfo
}