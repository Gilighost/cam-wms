var sendXML = require('./sendXML'),
    config = require('../../config');

function handleGetCapabilitiesRequest(req, res){
  res.sendFile(config.WMSServerCapabilities)
}

module.exports = handleGetCapabilitiesRequest;
