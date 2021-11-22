let currentMap = L.map("map").setView([39.65, 66.95], 8);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    'Imagery &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>',
  minZoom: 3,
  maxZoom: 17,
}).addTo(currentMap);

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
//initialize new map location:
currentMap.locate({ setView: true });
//initilaize new users cordinates:
let userCoordinates = new Object();

// Initialize new array for Qibla distance:
let pathToQibla = new Array();
// And line for draving (Polyline)
let route;
let polygone = L.polyline;
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
  // Block of dirty code
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
}
currentMap.on("locationfound", onLocationFound);
// To log error:
function onLocationError(e) {
  alert(
    `Хатолик юз берди. Биз сиз турган жойни аниқлай олмадик. Намоз вақтларини билиш учун харитадан ўзингизга керакли жойни белгиланг.\r\n\n ${e.message}`
  );
}

currentMap.on("locationerror", onLocationError);
// marker icon
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
  userCoordinates = e.latlng;
  globalScope();
}

currentMap.on("click", clickEvent);

// in another file, all parameters should be used inside of globalScope() function!!!
