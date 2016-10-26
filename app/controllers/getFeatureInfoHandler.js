/********************************************************************
 Handles the getFeatureInfo request

 Exports: handleGetFeatureInfoRequest (function)
 ********************************************************************/
var sendXML 			= require('./sendXML'),
 	mapHelper 			= require('./mapHelper'),
 	errorMessageBuilder = require('./errorMessageBuilder');

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