/********************************************************************
 Handles the getCapabilities request

 Exports: handleGetCapabilitiesRequest (function)
 ********************************************************************/
var config = require('../../config');

//send the capabilities document
//currently this WMS only supports version 1.3.0
function handleGetCapabilitiesRequest(req, res){
  res.sendFile(config.WMSServerCapabilities['1.3.0'])
}

module.exports = handleGetCapabilitiesRequest;
