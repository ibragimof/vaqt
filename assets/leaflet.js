(function () {
  // constants
  var d2r = Math.PI/180.0;
  var r2d = 180.0/Math.PI;
  var earthR = 6367000.0; // earth radius in meters (doesn't have to be exact)

  // alternative geodesic line intermediate points function
  // as north/south lines have very little curvature in the projection, we can use longitude (east/west) seperation
  // to calculate intermediate points. hopefully this will avoid the rounding issues seen in the full intermediate
  // points code that have been seen
  function geodesicConvertLine (start, end, convertedPoints) { // push intermediate points into convertedPoints

    var lng1 = start.lng * d2r;
    var lng2 = end.lng * d2r;
    var dLng = lng1-lng2;

    var segments = Math.floor(Math.abs(dLng * earthR / this.options.segmentsCoeff));
    if (segments < 2) { return; }

    // maths based on https://edwilliams.org/avform.htm#Int

    // pre-calculate some constant values for the loop
    var lat1 = start.lat * d2r;
    var lat2 = end.lat * d2r;
    var sinLat1 = Math.sin(lat1);
    var sinLat2 = Math.sin(lat2);
    var cosLat1 = Math.cos(lat1);
    var cosLat2 = Math.cos(lat2);
    var sinLat1CosLat2 = sinLat1*cosLat2;
    var sinLat2CosLat1 = sinLat2*cosLat1;
    var cosLat1CosLat2SinDLng = cosLat1*cosLat2*Math.sin(dLng);

    for (var i=1; i < segments; i++) {
      var iLng = lng1-dLng*(i/segments);
      var iLat = Math.atan(
        (sinLat1CosLat2 * Math.sin(iLng-lng2) - sinLat2CosLat1 * Math.sin(iLng-lng1))
          / cosLat1CosLat2SinDLng
      );
      convertedPoints.push(L.latLng(iLat*r2d, iLng*r2d));
    }
  }


  // iterate pairs of connected vertices with fn(), adding new intermediate vertices (if returned)
  function processPoly (latlngs, fn) {
    var result = [];

    // var isPolygon = this.options.fill; // !wrong: L.Draw use options.fill with polylines
    var isPolygon = this instanceof L.Polygon;
    if (isPolygon) {
      latlngs.push(latlngs[0]);
    } else {
      result.push(latlngs[0]);
    }
    for (var i = 0, len = latlngs.length - 1; i < len; i++) {
      fn.call(this, latlngs[i], latlngs[i+1], result);
      result.push(latlngs[i+1]);
    }
    return result;
  }

  function geodesicConvertLines (latlngs) {
    if (latlngs.length === 0) {
      return [];
    }

    // geodesic calculations have issues when crossing the anti-meridian. so offset the points
    // so this isn't an issue, then add back the offset afterwards
    // a center longitude would be ideal - but the start point longitude will be 'good enough'
    var lngOffset = latlngs[0].lng;

    // points are wrapped after being offset relative to the first point coordinate, so they're
    // within +-180 degrees
    latlngs = latlngs.map(function (a) { return L.latLng(a.lat, a.lng-lngOffset).wrap(); });

    var geodesiclatlngs = this._processPoly(latlngs,this._geodesicConvertLine);

    // now add back the offset subtracted above. no wrapping here - the drawing code handles
    // things better when there's no sudden jumps in coordinates. yes, lines will extend
    // beyond +-180 degrees - but they won't be 'broken'
    geodesiclatlngs = geodesiclatlngs.map(function (a) { return L.latLng(a.lat, a.lng+lngOffset); });

    return geodesiclatlngs;
  }

  var polyOptions = {
    segmentsCoeff: 5000
  };

  var PolyMixin = {
    _geodesicConvertLine: geodesicConvertLine,

    _processPoly: processPoly,

    _geodesicConvertLines: geodesicConvertLines,

    _geodesicConvert: function () {
      this._latlngs = this._geodesicConvertLines(this._latlngsinit);
      this._convertLatLngs(this._latlngs); // update bounds
    },

    options: polyOptions,

    initialize: function (latlngs, options) {
      L.Polyline.prototype.initialize.call(this, latlngs, options);
      this._geodesicConvert();
    },

    getLatLngs: function () {
      return this._latlngsinit;
    },

    _setLatLngs: function (latlngs) {
      this._bounds = L.latLngBounds();
      this._latlngsinit = this._convertLatLngs(latlngs);
    },

    _defaultShape: function () {
      var latlngs = this._latlngsinit;
      return L.LineUtil.isFlat(latlngs) ? latlngs : latlngs[0];
    },

    redraw: function () {
      this._geodesicConvert();
      return L.Path.prototype.redraw.call(this);
    }
  };

  L.GeodesicPolyline = L.Polyline.extend(PolyMixin);

  PolyMixin.options = polyOptions; // workaround for https://github.com/Leaflet/Leaflet/pull/6766/
  L.GeodesicPolygon = L.Polygon.extend(PolyMixin);

  L.GeodesicCircle = L.Polygon.extend({
    options: {
      segmentsCoeff: 1000,
      segmentsMin: 48
    },

    initialize: function (latlng, options, legacyOptions) {
      if (typeof options === 'number') {
        // Backwards compatibility with 0.7.x factory (latlng, radius, options?)
        options = L.extend({}, legacyOptions, {radius: options});
      }
      this._latlng = L.latLng(latlng);
      this._radius = options.radius; // note: https://github.com/Leaflet/Leaflet/issues/6656
      var points = this._calcPoints();
      L.Polygon.prototype.initialize.call(this, points, options);
    },

    setLatLng: function (latlng) {
      this._latlng = L.latLng(latlng);
      var points = this._calcPoints();
      this.setLatLngs(points);
    },

    setRadius: function (radius) {
      this._radius = radius;
      var points = this._calcPoints();
      this.setLatLngs(points);
    },

    getLatLng: function () {
      return this._latlng;
    },

    getRadius: function () {
      return this._radius;
    },

    _calcPoints: function () {

      // circle radius as an angle from the centre of the earth
      var radRadius = this._radius / earthR;

      // pre-calculate various values used for every point on the circle
      var centreLat = this._latlng.lat * d2r;
      var centreLng = this._latlng.lng * d2r;

      var cosCentreLat = Math.cos(centreLat);
      var sinCentreLat = Math.sin(centreLat);

      var cosRadRadius = Math.cos(radRadius);
      var sinRadRadius = Math.sin(radRadius);

      var calcLatLngAtAngle = function (angle) {
        var lat = Math.asin(sinCentreLat*cosRadRadius + cosCentreLat*sinRadRadius*Math.cos(angle));
        var lng = centreLng + Math.atan2(Math.sin(angle)*sinRadRadius*cosCentreLat, cosRadRadius-sinCentreLat*Math.sin(lat));

        return L.latLng(lat * r2d,lng * r2d);
      };

      var o = this.options;
      var segments = Math.max(o.segmentsMin,Math.floor(this._radius/o.segmentsCoeff));
      var points = [];
      for (var i=0; i<segments; i++) {
        var angle = Math.PI*2/segments*i;

        var point = calcLatLngAtAngle(angle);
        points.push(point);
      }

      return points;
    }

  });


  L.geodesicPolyline = function (latlngs, options) {
    return new L.GeodesicPolyline(latlngs, options);
  };

  L.geodesicPolygon = function (latlngs, options) {
    return new L.GeodesicPolygon(latlngs, options);
  };

  L.geodesicCircle = function (latlng, radius, options) {
    return new L.GeodesicCircle(latlng, radius, options);
  };

}());

let currentMap = L.map("map").setView([39.65, 66.95], 4);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  minZoom: 2,
  maxZoom: 17,
}).addTo(currentMap);
  //initialize new map location:
  currentMap.locate({ setView: true });
// Custom narker icons for map:
let logoIcon = L.icon({
  iconUrl: '/assets/logo.png',
  iconAnchor:   [15, 40], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -43] // point from which the popup should open relative to the iconAnchor
});

let kaabahIcon = L.icon({
  iconUrl: '/assets/kaaba.png',
  iconAnchor:   [5, 35], // point of the icon which will correspond to marker's location
  popupAnchor:  [18, -43] // point from which the popup should open relative to the iconAnchor
});

//initialize array for polygonal draw and getting distance:
let markerCoordinates = Array();

//initilaize new users cordinates:
let userCoordinates = new Object();

// Initialize new array for Qibla distance:
let pathToQibla = new Array();
// And line for draving (Polyline)
let route;
let polygone = L.geodesicPolyline;
// Add distance variable between qibla and destination:
let from;
let to;
let distance;

// qibla marker initilization and save coord.s in array
let qibla = L.marker([21.422505, 39.826216], {icon: kaabahIcon});
qibla.addTo(currentMap).bindPopup(
  "<b>Каъба, Макка шаҳри</b><br>(Қибла)"
).openPopup();
pathToQibla.push(qibla.getLatLng());


// to detect location:
function onLocationFound(e) {
  let radius = e.accuracy;

  let foundLocation = L.marker(e.latlng, {icon: logoIcon})
    .addTo(currentMap)
    .bindPopup(
      "<b>Харитадаги ўрнингиз</b><br>(Аниқлик &asymp; " +
        Math.floor(radius) +
        " метргача)"
    )
    .openPopup();

  L.circle(e.latlng, radius).addTo(currentMap);
  userCoordinates = e.latlng;
  globalScope();

  // #######################
  // tested. works
  // Draw line between Qibla and this location:
  pathToQibla.push(foundLocation.getLatLng());
  route = polygone(pathToQibla, {
    color: 'red'
  }).addTo(currentMap);
  // get
  from = qibla.getLatLng();
  to = foundLocation.getLatLng();
  distance = Math.trunc(from.distanceTo(to) / 1000);
  document.getElementById('distance').innerHTML = distance;
  // #######################
  // tested. works
}
currentMap.on("locationfound", onLocationFound);

// To log error:
function onLocationError(e) {
  alert(
    `Хатолик юз берди. Биз сиз турган жойни аниқлай олмадик. Намоз вақтларини билиш учун харитадан ўзингизга керакли жойни белгиланг.\r\n\n ${e.message}`
  );
}
currentMap.on("locationerror", onLocationError);


// Onclick (select location):
function clickEvent(e) {
  if (typeof newMarker === "undefined") {
    newMarker = new L.marker(e.latlng);
    newMarker
      .addTo(currentMap)
      .bindPopup(
        "<b>Жой танланди</b><br>" + e.latlng.toString().slice(6)
      )
      .openPopup();
      
  } else {
    newMarker
      .setLatLng(e.latlng)
      .bindPopup(
        "<b>Жой танланди</b><br>" + e.latlng.toString().slice(6)
      )
      .openPopup();
  }
  // ####### tested. works as charm
  pathToQibla[1] = (newMarker.getLatLng());
  if(route) {
  currentMap.removeLayer(route);
  route = polygone(pathToQibla, {color: 'red'}).addTo(currentMap);
  from = qibla.getLatLng();
  to = newMarker.getLatLng();
  distance = Math.trunc(from.distanceTo(to) / 1000);
  document.getElementById('distance').innerHTML = distance;
  }
  else {
    route = polygone(pathToQibla, {color: 'red'}).addTo(currentMap);
  from = qibla.getLatLng();
  to = newMarker.getLatLng();
  distance = Math.trunc(from.distanceTo(to) / 1000);
  document.getElementById('distance').innerHTML = distance;
  }
  userCoordinates = e.latlng;
  globalScope();
}

currentMap.on("click", clickEvent);
// in another file, all parameters should be used inside of globalScope() function!!!