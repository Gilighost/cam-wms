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
    availableStyles: ['default']
}

exports.world_population = {
	name: 'world_merc',
	srs: '+init=epsg:4326',
	datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/world_population/ne_110m_admin_0_countries.shp'
    },
    availableStyles: ['population', 'default']
}

exports.national_parks = {
	name: 'national_parks',
	srs: '+init=epsg:4326',
	datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/national_parks/ne_10m_parks_and_protected_lands_area.shp'
    },
    availableStyles: ['parks_default']
}

exports.reefs = {
    name: 'reefs',
    srs: '+init=epsg:4326',
    datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/reefs/ne_10m_reefs.shp'
    },
    availableStyles: ['reefs_default']
}

exports.ports = {
    name: 'ports',
    srs: '+init=epsg:4326',
    datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/ports/ne_10m_ports.shp'
    },
    availableStyles: ['ports_default']
}

exports.airports = {
    name: 'airports',
    srs: '+init=epsg:4326',
    datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/airports/ne_10m_airports.shp'
    },
    availableStyles: ['airports_default']
}

exports.railroads = {
    name: 'railroads',
    srs: '+init=epsg:4326',
    datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/railroads/ne_10m_railroads.shp'
    },
    availableStyles: ['railroads_default']
}

exports.steil_run = {
    name: 'steil_run',
    srs: '+init=epsg:4326',
    datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/steil_run/steil_run.shp'
    },
    availableStyles: ['steil_default']
}

exports.rivers = {
    name: 'rivers',
    srs: '+init=epsg:4326',
    datasource: {
        type: 'shape',
        file: config.geodataDirectory + '/rivers/ne_110m_rivers_lake_centerlines.shp'
    },
    availableStyles: ['rivers_default']
}
//http://www.srh.noaa.gov/ridge2/shapefiles/
