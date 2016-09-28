/********************************************************************
 Configuration options
 ********************************************************************/

exports.port = 4326;

exports.logLevel = 'dev';

exports.root = __dirname;

exports.WMSServerCapabilities = __dirname + '/xml/WMSServer.xml';

exports.fontDirectory = __dirname + '/map/fonts';

exports.geodataDirectory = __dirname + '/map/geodata';

exports.styles = __dirname + '/map/styles.xml';

exports.layers = __dirname + '/map/layers.js';

exports.supportedInfoFormats = ['json'];
