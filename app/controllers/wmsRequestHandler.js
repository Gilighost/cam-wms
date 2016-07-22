var config = require('../../config'),
    getCapabilitiesHandler = require('./getCapabilitiesHandler'),
    getMapHandler = require('./getMapHandler'),
    errorMessageBuilder = require('./errorMessageBuilder'),
    sendXML = require('./sendXML');

module.exports =
  function(req, res) {

    req.query = keysToLowerCase(req.query);

    var service = req.query.service ? req.query.service.toLowerCase() : undefined;
    if(service == 'wms'){
      var request = req.query.request ? req.query.request.toLowerCase() : undefined;
      switch(request){
          case 'getcapabilities':
              getCapabilitiesHandler(req, res)
              break;
          case 'getmap':
              getMapHandler(req, res)
              break;
          default:
              sendXML(res, errorMessageBuilder.invalidQueryFormat());
      }
    }
    else{
      sendXML(res, errorMessageBuilder.invalidQueryFormat());
    }
  };


function keysToLowerCase(obj){
    Object.keys(obj).forEach(function (key) {
        var k = key.toLowerCase();

        if (k !== key) {
            obj[k] = obj[key];
            delete obj[key];
        }
    });
    return (obj);
}