var mymap = L.map("map").setView(
    [39.65, 66.95],
    7 
  );
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'Картография &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>',
    minZoom: 6,
    maxZoom: 14,
    }).addTo(mymap);
  //initialize new map location:
  mymap.locate({setView: true, maxZoom: 16});
  //initilaize new users cordinates:
  var userCoordinates = new Object();

  // to detect location:
  function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);
  // marker icon
  function clickEvent(e) {

    if (typeof(newMarker)==='undefined'){
        newMarker = new L.marker(e.latlng);
        newMarker.addTo(mymap).bindPopup(
          "<b>Выбрано местоположение</b><br>" +
                  e.latlng.toString().slice(6)
              )
              .openPopup();;}
    else { newMarker.setLatLng(e.latlng).bindPopup(
            "<b>Выбрано местоположение</b><br>" +
              e.latlng.toString().slice(6)
          )
          .openPopup();}
    userCoordinates = e.latlng;
    now();
}

mymap.on('click', clickEvent);

function now(){
// write in document user's coordinates:
document.getElementById("geoLocationLat").innerHTML = userCoordinates.lat;
document.getElementById("geoLocationLong").innerHTML = userCoordinates.lng;
}
