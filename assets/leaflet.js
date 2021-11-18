var mymap = L.map("map").setView(
    [39.65, 66.95],
    7 
  );

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'Картография &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>',
    minZoom: 6,
    maxZoom: 14,
    }).addTo(mymap);

  //initilaize new cordinates
  var lat;
  var lng;
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


    lat = e.latlng.lat;
    lng = e.latlng.lng;
    now();
}

mymap.on('click', clickEvent);

function now(){
//call lat and long inside function only:
document.getElementById("geoLocationLat").innerHTML = lat;
document.getElementById("geoLocationLong").innerHTML = lng;
}
