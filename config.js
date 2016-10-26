/********************************************************************
 Configuration options
 ********************************************************************/

exports.port = 4326;

exports.logLevel = 'dev';

//path to capabilities document (for each supported version)
exports.WMSServerCapabilities = {
	"1.3.0" : __dirname + '/xml/WMSServer.1.3.0.xml'
};

//font locations for use in map styles
exports.fontDirectory = __dirname + '/map/fonts';

//directory containing available datasources
exports.geodataDirectory = __dirname + '/map/geodata';

//path to XML document that defines available styles
exports.styles = __dirname + '/map/styles.xml';

//path to js file that defines the available layers
exports.layers = __dirname + '/map/layers.js';

//array of supported formats for the getFeatureInfo request
exports.supportedInfoFormats = ['json'];
