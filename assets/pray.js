function globalScope() {

    // Time stamps' initializer:
  date = new Date();

  // new report initializer:
  let day = SunCalc.getTimes(date, userCoordinates.lat,
    userCoordinates.lng);
    console.log(JSON.stringify(day));
  // Time (output) formatter:
  function formatTime(date, postfix) {
    if (isNaN(date)) {
      return "&nbsp;&nbsp;n/a&nbsp;&nbsp;";
    }

    let hours = date.getHours(),
      minutes = date.getMinutes(),
      ap;

    if (postfix) {
      ap = hours < 12 ? "am" : "pm";
      if (hours == 0) {
        hours = 12;
      }
      if (hours > 12) {
        hours -= 12;
      }
    } else {
      hours = hours < 10 ? "0" + hours : "" + hours;
    }

    minutes = minutes < 10 ? "0" + minutes : "" + minutes;

    return hours + ":" + minutes + (postfix ? " " + ap : "");
  }

  // write in document user's coordinates & date:
  $('#todayDateIs').html(date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear());
  $('#geoLocationLat').html(userCoordinates.lat);
  $('#geoLocationLong').html(userCoordinates.lng);

  SunCalc.addTime(-15, "fajrTime", "ishaTime");
  SunCalc.addTime(-16, "subhEnd");
  console.log(day);
  
  // Add morning times massive:
  let morning = day.morningTwilight;

  $('#fasting').html(formatTime(day.nightEnd));
  // add custom time fajr:
  document.getElementById("fajrTime").innerHTML = JSON.stringify(times);

  // write time for dohr:
  document.getElementById("dohrTime").innerHTML =
    times.solarNoon.toLocaleString("en-US") +
    ":" +
    times.solarNoon.getMinutes();

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

}
