function globalScope() {
  // write in document user's coordinates:
  document.getElementById("geoLocationLat").innerHTML = userCoordinates.lat;
  document.getElementById("geoLocationLong").innerHTML = userCoordinates.lng;

  SunCalc.addTime(-15, "fajrTime", "ishaTime");
  SunCalc.addTime(-16, "subhEnd");
  let times = SunCalc.getTimes(
    new Date(),
    userCoordinates.lat,
    userCoordinates.lng
  );
  console.log(times);
  // add asr time method:

  // let times = SunCalc.getTimes(new Date(), 37.717835865297644, 67.60712147320088);
  // add custom time fajr:
  document.getElementById("fajrTime").innerHTML =
    JSON.stringify(times);

  // write time for dohr:
  document.getElementById("dohrTime").innerHTML =
    times.solarNoon.getHours() + ":" + times.solarNoon.getMinutes();

  //write for Asr:
  document.getElementById("asrTime").innerHTML = "Not calculated yet";

  //write for Maghrib:
  document.getElementById("maghribTime").innerHTML =
    times.sunset.getHours() + ":" + times.sunset.getMinutes();

  // add custom time fajr:
  document.getElementById("ishaTime").innerHTML =
    times.ishaTime.getHours() + ":" + times.ishaTime.getMinutes();

  // Suhur
  document.getElementById("subhEnd").innerHTML =
    times.subhEnd.getHours() + ":" + times.subhEnd.getMinutes();

  // Midnight
  document.getElementById("midnight").innerHTML =
    times.nadir.getHours() + ":" + times.nadir.getMinutes();

  // sunrise long period
  document.getElementById("sunriseRestricted").innerHTML =
    times.sunrise.getHours() +
    ":" +
    times.sunrise.getMinutes() +
    "—" +
    times.sunriseEnd.getHours() +
    ":" +
    times.sunriseEnd.getMinutes();

  //sunrset long period:
  document.getElementById("sunsetRestricted").innerHTML =
    times.sunsetStart.getHours() +
    ":" +
    times.sunsetStart.getMinutes() +
    "—" +
    times.sunset.getHours() +
    ":" +
    times.sunset.getMinutes();

  document.getElementById("resultDate").innerHTML =
    new Date().toLocaleDateString();

  let longitude = document.getElementById(geoLocationLat);
}
