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
