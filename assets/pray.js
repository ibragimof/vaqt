function globalScope() {
    // Fajr and maghrib time scopes (17' degree set):
    SunCalc.addTime(-16.8, 'fajrStart', 'maghribEnd');
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

  SunCalc.addTime(-16.5, "subhEnd");
  console.log(day);
// Fasting time (-18' degree):
  $('#fasting').html(formatTime(day.nightEnd));
// Fajr time starts (-17' degree):
 $('#fajr').html(formatTime(day.fajrStart));
  // add recommended time fajr:
  $('#fajrRecommendation').html(formatTime(day.nauticalDawn));
  // Sunrise start time (fajr ends)
  // there is one minute additional time for safety reasons:
 let sunriseSafetyTime = new Date(day.sunrise);
 sunriseSafetyTime.setMinutes(day.sunrise.getMinutes() - 1);
  $('#sunriseStart').html(formatTime(sunriseSafetyTime));
  
// Sunrise end time (ishroq salah starts)
  // there is one minute additional time for safety reasons:
  let sunriseEndSafetyTime = new Date(day.sunriseEnd);
  sunriseEndSafetyTime.setMinutes(day.sunriseEnd.getMinutes() + 1);
   $('#sunriseEnd').html(formatTime(sunriseEndSafetyTime));
  
   // Choshgoh time starts (Duhaa salah time)
  $('#choshgoh').html(formatTime(day.goldenHourEnd));

  // Choshgoh time starts (Duhaa salah time)
  $('#noon').html(formatTime(day.solarNoon));

}
