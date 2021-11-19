var mymap = L.map("map").setView([39.65, 66.95], 14);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    'Картография &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>',
  minZoom: 6,
  maxZoom: 16,
}).addTo(mymap);
//initialize new map location:
mymap.locate({ setView: true });
//initilaize new users cordinates:
var userCoordinates = new Object();

// to detect location:
function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng)
    .addTo(mymap)
    .bindPopup(
      "<b>Ваше текущее местоположение</b><br>(с точностью до &asymp;" +
        Math.floor(radius) +
        " метров от  указанной точки)"
    )
    .openPopup();

  L.circle(e.latlng, radius).addTo(mymap);
}
mymap.on("locationfound", onLocationFound);
// To log error:
function onLocationError(e) {
  alert(e.message);
}

mymap.on('locationerror', onLocationError);
// marker icon
function clickEvent(e) {
  if (typeof newMarker === "undefined") {
    newMarker = new L.marker(e.latlng);
    newMarker
      .addTo(mymap)
      .bindPopup(
        "<b>Выбрано местоположение</b><br>" + e.latlng.toString().slice(6)
      )
      .openPopup();
  } else {
    newMarker
      .setLatLng(e.latlng)
      .bindPopup(
        "<b>Выбрано местоположение</b><br>" + e.latlng.toString().slice(6)
      )
      .openPopup();
  }
  userCoordinates = e.latlng;
  now();
}

mymap.on("click", clickEvent);

function now() {
  // write in document user's coordinates:
  document.getElementById("geoLocationLat").innerHTML = userCoordinates.lat;
  document.getElementById("geoLocationLong").innerHTML = userCoordinates.lng;
}
