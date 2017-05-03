/********************************************************************
 Validates request, directs request to correct handler

 Exports: function
 ********************************************************************/
var getCapabilitiesHandler	= require('./getCapabilitiesHandler'),
	getMapHandler			= require('./getMapHandler'),
	getFeatureInfoHandler	= require('./getFeatureInfoHandler'),
	errorMessageBuilder		= require('./errorMessageBuilder'),
	sendXML					= require('./sendXML');

/*
TEST URLS:
/wms?service=wms&request=getcapabilities
/wms?service=wms&request=getmap&layers=world_merc&styles=&format=png&height=500&width=500&bbox=-166.9921875,-168.3984375,166.9921875,168.3984375&crs=epsg:4326&version=1.3.0
/wms?service=wms&request=getfeatureinfo&layers=world_merc&styles=&format=png&height=500&width=500&bbox=-166.9921875,-168.3984375,166.9921875,168.3984375&crs=epsg:4326&version=1.3.0&query_layers=&info_format=&i=&j=
*/

module.exports =
function(req, res) {
	validateRequest(req, function(error, mapReqObj){
		if(error) {
			sendXML(res, error);
		}
		else {
			switch(mapReqObj.request){
				case 'getcapabilities':
					getCapabilitiesHandler(mapReqObj, res)
					break;
				case 'getmap':
					getMapHandler(mapReqObj, res)
					break;
				case 'getfeatureinfo':
					getFeatureInfoHandler(mapReqObj, res)
					break;
				default:
					sendXML(res, errorMessageBuilder.invalidQueryFormat());
			}
		}
	})
}

//Object used to validate requests
const REQUIRED_REQUEST_PARAMETERS = {
	base: [
		{type: 'string', name: 'service'},
		{type: 'string', name: 'request'}
	],
	getMap: [
		{type: 'array', name: 'layers'},
		{type: 'array', name: 'styles'},
		{type: 'string', name: 'format'},
		{type: 'int', name: 'height'},
		{type: 'int', name: 'width'},
		{type: 'array', name: 'bbox'},
		{type: 'string', name: 'version'},
		{type: 'string', name: 'srs'}
	],
	getFeatureInfo: [
		{type: 'array', name: 'layers'},
		{type: 'array', name: 'styles'},
		{type: 'string', name: 'format'},
		{type: 'int', name: 'height'},
		{type: 'int', name: 'width'},
		{type: 'array', name: 'bbox'},
		{type: 'string', name: 'version'},
		{type: 'string', name: 'srs'},
		{type: 'array', name: 'query_layers'},
		{type: 'string', name: 'info_format'},
		{type: 'int', name: 'i'},
		{type: 'int', name: 'j'}
	]
}

//makes sure request contains required parameters
//callback function:
//  param: error message for if error occurred(otherwise undefined)
//  param: formatted request object
function validateRequest(req, callback){
	var mapReqObj = {}
	var errorMessage = undefined;
	req.query = keyAndValueToLowerCase(req.query);

	mapReqObj = getMapRequestObject('base', req.query);
	if(mapReqObj.missingParams.length > 0){
		errorMessage = errorMessageBuilder.buildServiceExceptionReportForMissingParams(mapReqObj.missingParams);
		callback(errorMessage);
	}
	else{
		var request = req.query['request'];
		switch(request){
			case 'getcapabilities':
				//base is all thats required
				break;
			case 'getmap':
				extend(mapReqObj, getMapRequestObject('getMap', req.query));
				break;
			case 'getfeatureinfo':
				extend(mapReqObj, getMapRequestObject('getFeatureInfo', req.query));
				break;
			default:
				errorMessage = errorMessageBuilder.buildServiceExceptionReportForError('InvalidRequest');
		}

		if(mapReqObj.missingParams.length > 0){
			errorMessage = errorMessageBuilder.buildServiceExceptionReportForMissingParams(mapReqObj.missingParams);
		}
		callback(errorMessage, mapReqObj)
	}
}

//formats request object for next handler
function getMapRequestObject(requestType, requestQuery){
	var mapRequestObject = {};
	mapRequestObject.missingParams = [];
	if(Object.keys(requestQuery).indexOf('srs') == -1 && Object.keys(requestQuery).indexOf('crs') != -1){
		requestQuery['srs'] = requestQuery['crs'];
		delete requestQuery['crs'];
	}
	REQUIRED_REQUEST_PARAMETERS[requestType].forEach(function(element, index, array){
		if(Object.keys(requestQuery).indexOf(element.name) == -1){
			mapRequestObject.missingParams.push(element.name);
		}
		else{
			switch(element.type){
				case "int":
					mapRequestObject[element.name] = parseInt(requestQuery[element.name]);
					break;
				case "array":
					mapRequestObject[element.name] = requestQuery[element.name].split(',');
					break;
				default:
					mapRequestObject[element.name] = requestQuery[element.name];
			}
		}
	});
	return mapRequestObject;
}

//converts object to contain only lowercase characters
function keyAndValueToLowerCase(obj){
	Object.keys(obj).forEach(function (key) {
		var k = key.toLowerCase();
		if (k !== key) {
			obj[k] = obj[key];
			delete obj[key];
		}
	});
	for(value in obj){
		obj[value] = obj[value].toLowerCase();
	}
	return obj;
}

//Combine two Objects
function extend(obj, src){
	for (var key in src){
		if (src.hasOwnProperty(key))
			obj[key] = src[key];
	}
	return obj;
}
