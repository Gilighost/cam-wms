/********************************************************************
Contains logic used to interact with geographic data

 Exports:
	createMap
	createMapLayer
	createMapImage
	bboxIsValid
	getFeatureInfo
 ********************************************************************/
var mapnik		= require('mapnik'),
	config		= require('../../config'),
	WMSlayers	= require(config.layers);

// register fonts and datasource plugins
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

//Creates a mapnik map layer using a given style
//name - name of layer
//style - name of style offered for layer
//returns a Mapnik map layer
function createMapLayer(name, style){
	var layerOptions = WMSlayers[name];
	var mapLayer = new mapnik.Layer(layerOptions.name, layerOptions.srs);
	if(layerOptions.availableStyles.indexOf(style) > -1 || style == ''){
		mapLayer.styles = [(style == '') ? layerOptions.availableStyles[0] : style ];
	}
	mapLayer.datasource = new mapnik.Datasource(layerOptions.datasource);
	return mapLayer;
}

//Creates an image buffer using a map object
//mapReq - map request object
//callback - function that will handle errors and image buffer
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

//Creates a feature set using a map object
//mapReq - map request object
//callback - function that will handle errors and array of features
function getFeatureInfo(mapReq, callback){
	var getFeatureInfoError = validateMapQuery(mapReq);
	if(!getFeatureInfoError){
		createMap(mapReq, function(createMapError, map){
			if(createMapError){
				callback(createMapError);
			}
			else{
				map.queryMapPoint(mapReq.i, mapReq.j, {}, function(err, results) {
					if (err) throw err;

					console.log(results)
					var attributes = [];
					for(var resultsIndex = 0; resultsIndex < results.length; ++resultsIndex){
						if(mapReq.query_layers.indexOf(results[resultsIndex].layer) != -1){
							var features = results[resultsIndex].featureset; // assuming you're just grabbing the first object in the array
							var feature;
							while ((feature = features.next())) {// grab all of the attributes and push to a temporary array
								attributes.push(feature.attributes());
							}
						}
					}
					callback(null, attributes);
				});
			}
		});
	} else{
		callback(getFeatureInfoError)
	}
}

//makes sure the BBOX is logical
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

//Returns error code if any parameters are invalid
function validateMapQuery(mapReq){
	//check query_layers
	if(mapReq.query_layers[0] == ''){
		return 'EmptyQueryLayers';
	}
	for(var layer in mapReq.query_layers){
		if(mapReq.layers.indexOf(mapReq.query_layers[layer]) == -1){
			return 'InvalidQueryLayers';
		}
	}

	//check info_format
	if(mapReq.info_format == ''){
		return 'EmptyInfoFormat';
	}
	if(config.supportedInfoFormats.indexOf(mapReq.info_format) == -1){
		return 'InvalidInfoFormat';
	}

	//check i, j coordinates
	if(mapReq.i < 0 || mapReq.i < 0 || mapReq.i > mapReq.width || mapReq.j > mapReq.height)
	{
		return 'InvalidImageCoordinates';
	}

	return null;
}

module.exports = {
	createMap: createMap,
	createMapLayer: createMapLayer,
	createMapImage: createMapImage,
	bboxIsValid: bboxIsValid,
	getFeatureInfo: getFeatureInfo
}
