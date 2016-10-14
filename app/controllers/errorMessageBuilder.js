var xmlbuilder = require('xmlbuilder');

module.exports.invalidQueryFormat = function(){
  var xml = xmlbuilder.create('ServiceExceptionReport')
        .att('xmlns', "http://www.opengis.net/ogc")
        .att( 'xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance")
        .att('version', "1.3.0")
        .att('xsi:schemaLocation', "http://www.opengis.net/ogc http://schemas.opengis.net/wms/1.3.0/exceptions_1_3_0.xsd")
      .ele('ServiceException', {'code': 'InvalidFormat'}, "Can't parse XML request.")
      .end({ pretty: true});
      return xml;
}

const ERROR_CODES = {
	InvalidRequest: "Request contains invalid 'REQUEST' parameter.",
	InvalidBBox: "Request contains a BBOX that is incomplete or illogical.",
	InvalidFormat: "Request contains a Format not offered by the server.",
	InvalidCRS: "Request contains a CRS not offered by the server for one or more of the Layers in the request.",
	LayerNotDefined: "GetMap request is for a Layer not offered by the server", //, or GetFeatureInfo request is for a Layer not shown on the map.
	StyleNotDefined: "Request is for a Layer in a Style not offered by the server.",
	LayerNotQueryable: "GetFeatureInfo request is applied to a Layer which is not declared queryable.",
	InvalidPoint: "GetFeatureInfo request contains invalid I or J value.",
	CurrentUpdateSequence: "Value of (optional) UpdateSequence parameter in GetCapabilities request is equal to current value of service metadata update sequence number.",
	InvalidUpdateSequence: "Value of (optional) UpdateSequence parameter in GetCapabilities request is greater than current value of service metadata update sequence number.",
	MissingDimensionValue: "Request does not include a sample dimension value, and the server did not declare a default value for that dimension.",
	InvalidDimensionValue: "Request contains an invalid sample dimension value.",
	OperationNotSupported: "Request is for an optional operation that is not supported by the server.",

	EmptyQueryLayers: "Parameter 'QUERY_LAYERS' cannot be empty.",
	InvalidQueryLayers: "Requested layer in 'QUERY_LAYERS' is not in 'LAYERS' parameter.",
	EmptyInfoFormat: "Parameter 'INFO_FORMAT' cannot be empty.",
	InvalidInfoFormat: "Requested 'INFO_FORMAT' is not offered by the server.",
	InvalidImageCoordinates: "Requested I, J pixel coordinates are outside of queried map."
};

module.exports.buildServiceExceptionReportForMissingParams = function(missingParams){

	var ServiceExceptionReport = xmlbuilder.create('ServiceExceptionReport')
        .att('xmlns', "http://www.opengis.net/ogc")
        .att( 'xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance")
        .att('version', "1.3.0")
        .att('xsi:schemaLocation', "http://www.opengis.net/ogc http://schemas.opengis.net/wms/1.3.0/exceptions_1_3_0.xsd");
	
	for(var param in missingParams){
		var paramName = missingParams[param];
		ServiceExceptionReport.ele('ServiceException', {'code': 'MissingParameter'}, "Parameter '" + paramName.toUpperCase() + "' can't be empty.")
	}

	return ServiceExceptionReport.end({pretty: true});
}

//message param is optional, will only be used if errorCode is not already defined in ERROR_CODES
module.exports.buildServiceExceptionReportForError = function(errorCode, message){
	var ServiceExceptionReport = xmlbuilder.create('ServiceExceptionReport')
	        .att('xmlns', "http://www.opengis.net/ogc")
	        .att( 'xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance")
	        .att('version', "1.3.0")
	        .att('xsi:schemaLocation', "http://www.opengis.net/ogc http://schemas.opengis.net/wms/1.3.0/exceptions_1_3_0.xsd");

	if(Object.keys(ERROR_CODES).indexOf(errorCode) != -1){
		ServiceExceptionReport.ele('ServiceException', {'code': errorCode}, ERROR_CODES[errorCode]);
    } else{
		ServiceExceptionReport.ele('ServiceException', {'code': errorCode}, message);
    }
   	
   	return ServiceExceptionReport.end({pretty: true});
}