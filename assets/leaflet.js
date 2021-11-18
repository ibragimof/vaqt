var mymap = L.map("map").setView(
    [37.717835865297644, 67.60712147320088],
    13
  );

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    }).addTo(mymap);

  //initilaize new cordinates
  var lat;
  var lng;

  function onMapClick(e) {
    L.marker(e.latlng)
      .addTo(mymap)
      .bindPopup(
        "<b>Времена по месту</b><br>" +
          e.latlng.toString().slice(6)
      )
      .openPopup();
      lat = e.latlng.lat;
      lng = e.latlng.lng;
  }
  mymap.on("click", onMapClick);
  
  