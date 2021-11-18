var mymap = L.map("map").setView(
    [39.65, 66.95],
    9 
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
        newMarker = new L.marker(e.latlng, { draggable: true });
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
    console.log(lat + " Inside");
    now();
}

mymap.on('click', clickEvent);
console.log(lat + " Global");

function now(){
console.log(lat + " Global after click");
}