
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.mapbox.accessToken = 'pk.eyJ1IjoiY2xhZmVybmV5IiwiYSI6ImI4YTYxODk3MTJmYWY0OWU3MTY1NTU1MDJkN2M5OWQ4In0.q8BO7AkBw7tEh5UKyL8v2A';

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);

var wmsOptions = { layers: 'national_parks' };
L.tileLayer.wms('http://45.55.89.43:2468/WMS?', wmsOptions).addTo(mymap);
