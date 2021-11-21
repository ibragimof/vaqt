let mymap = L.map("map").setView([39.65, 66.95], 8);
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    'Imagery &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>',
  minZoom: 3,
  maxZoom: 17,
}).addTo(mymap);
//initialize new map location:
mymap.locate({ setView: true });
//initilaize new users cordinates:
let userCoordinates = new Object();

// to detect location:
function onLocationFound(e) {
  let radius = e.accuracy;

  L.marker(e.latlng)
    .addTo(mymap)
    .bindPopup(
      "<b>Харитадаги ўрнингиз</b><br>(Аниқлик &asymp; " +
        Math.floor(radius) +
        " метргача)"
    )
    .openPopup();

  L.circle(e.latlng, radius).addTo(mymap);
  userCoordinates = e.latlng;
  globalScope();
}
mymap.on("locationfound", onLocationFound);
// To log error:
function onLocationError(e) {
  alert(
    `Хатолик юз берди. Биз сиз турган жойни аниқлай олмадик. Намоз вақтларини билиш учун харитадан ўзингизга керакли жойни белгиланг.\r\n\n ${e.message}`
  );
}

mymap.on("locationerror", onLocationError);
// marker icon
function clickEvent(e) {
  if (typeof newMarker === "undefined") {
    newMarker = new L.marker(e.latlng);
    newMarker
      .addTo(mymap)
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

mymap.on("click", clickEvent);

// in another file, all parameters should be used inside of globalScope() function!!!
