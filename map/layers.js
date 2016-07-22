/*****************************************
Include available layers here
******************************************/
var config = require('../config')

exports.world_merc = {
	name: 'world_merc',
	srs: '+init=epsg:3857',
	datasource: {
        type: 'geojson',
        file: config.geodataDirectory + '/world_merc/world_merc.json'
    },
    defaultStyle: 'default'
}

exports.world_population = {
	name: 'world_merc',
	srs: '+init=epsg:4326',
	datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/world_population/ne_110m_admin_0_countries.shp'
    },
    defaultStyle: 'population'
}