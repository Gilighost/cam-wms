var sendXML = require('./sendXML');
var mapnik = require("mapnik");
var mapHelper = require('./mapHelper')
var fs = require("fs");
var config = require('../../config');
var colors = require('colors')
//var WMSlayers = require(config.layers)
var errorMessageBuilder = require('./errorMessageBuilder')

function handleGetMapRequest(mapReqObj, res){	
	mapHelper.createMapImage(mapReqObj, function(err, mapImg){
        if(err){                    
            sendXML(res, errorMessageBuilder.buildServiceExceptionReportForError(err));
        }
        else{
            res.set('content-type', 'image/' + mapReqObj.format);
            res.send(mapImg);
        }
    });

}
module.exports = handleGetMapRequest;