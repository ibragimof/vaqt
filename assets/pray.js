function globalScope() {
    // write in document user's coordinates:
    document.getElementById("geoLocationLat").innerHTML = userCoordinates.lat;
    document.getElementById("geoLocationLong").innerHTML = userCoordinates.lng;
    
    SunCalc.addTime(-15, "fajrTime", "ishaTime");
  SunCalc.addTime(-16, "subhEnd");
  var vaqt = SunCalc.getTimes(new Date(), `${userCoordinates.lat}`, userCoordinates.lng);
  console.log(`${window.userCoordinates.toString()} sd dsdssd`);
  console.log(vaqt);
  // add asr time method:
  
  // var vaqt = SunCalc.getTimes(new Date(), 37.717835865297644, 67.60712147320088);
  // add custom time fajr:
  document.getElementById("fajrTime").innerHTML = vaqt.fajrTime.getHours() + ':' + vaqt.fajrTime.getMinutes();
  
  // write time for dohr:
  document.getElementById("dohrTime").innerHTML = vaqt.solarNoon.getHours() + ':' + vaqt.solarNoon.getMinutes();
  
  //write for Asr:
  document.getElementById("asrTime").innerHTML = 'Not calculated yet';
  
  //write for Maghrib:
  document.getElementById("maghribTime").innerHTML = vaqt.sunset.getHours() + ':' + vaqt.sunset.getMinutes();
  
  // add custom time fajr:
  document.getElementById("ishaTime").innerHTML = vaqt.ishaTime.getHours() + ':' + vaqt.ishaTime.getMinutes();
  
  // Suhur
  document.getElementById("subhEnd").innerHTML = vaqt.subhEnd.getHours() + ':' + vaqt.subhEnd.getMinutes();
  
  // Midnight
  document.getElementById("midnight").innerHTML = vaqt.nadir.getHours() + ':' + vaqt.nadir.getMinutes();
  
  // sunrise long period
  document.getElementById("sunriseRestricted").innerHTML = vaqt.sunrise.getHours() + ':' + vaqt.sunrise.getMinutes() + "—" + vaqt.sunriseEnd.getHours() + ':' + vaqt.sunriseEnd.getMinutes();
  
  //sunrset long period:
  document.getElementById("sunsetRestricted").innerHTML = vaqt.sunsetStart.getHours() + ':' + vaqt.sunsetStart.getMinutes() + "—" + vaqt.sunset.getHours() + ':' + vaqt.sunset.getMinutes();
  
  document.getElementById("resultDate").innerHTML = new Date().toLocaleDateString();
  
  var longitude = document.getElementById(geoLocationLat);
  console.log(longitude);
  }
  