# cam-wms

This is a Web Map Server I built with NodeJS.

It uses:
* [Express](https://github.com/expressjs/express)
* [Mapnik](https://github.com/mapnik/node-mapnik)
* [XMLbuilder](https://github.com/oozcitak/xmlbuilder-js)

### What is a Web Map Server?
>A Web Map Service (WMS) is a standard protocol for serving (over the Internet) georeferenced map images which a map server generates using data from a GIS database. The Open Geospatial Consortium developed the specification and first published it in 1999.

>-Wikipedia

###This WMS supports these requests:
* GetCapabilities
  *   This operation requests metadata about the operations, services, and data (“capabilities”) that are offered by a WMS server.
* GetMap
  *  This operation requests that the server generate a map. The core parameters specify one or more layers and styles to appear on the map, a bounding box for the map extent, a target spatial reference system, and a width, height, and format for the output. The information needed to specify values for parameters such as layers, styles and srs can be obtained from the Capabilities document. The response is a map image, or other map output artifact, depending on the format requested. 
* GetFeatureInfo
  *   This operation requests the spatial and attribute data for the features at a given location on a map.
  
###Implementation Specification
To see the full Implementation Specification see the [OpenGIS® Web Map Server Implementation Specification](http://www.opengeospatial.org/standards/wms#downloads)

#### TODO:
* Allow more output formats for:
  * Exceptions
  * GetFeatureInfo
* Implement more optional parameters
* Allow CartoCSS layer styling
