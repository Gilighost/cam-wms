var sendXML = require('./sendXML');
var mapnik = require("mapnik");
var mapHelper = require('./mapHelper')
var fs = require("fs");
var config = require('../../config');
var colors = require('colors')
var errorMessageBuilder = require('./errorMessageBuilder')

function handleGetFeatureInfoRequest(mapReqObj, res){	
	mapHelper.getFeatureInfo(mapReqObj, function(err, featureInfo){
        if(err){                    
            sendXML(res, errorMessageBuilder.buildServiceExceptionReportForError(err));
        }
        else{
            res.set('content-type', 'application/json');
            res.send(featureInfo);
        }
    });

}
module.exports = handleGetFeatureInfoRequest;