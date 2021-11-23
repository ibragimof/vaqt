function globalScope() {
  
  SunCalc.addTime(getAsrTime(), "doNotUse", "asrHanafiy");
  // Time stamps' initializer:
  let date = new Date();
  let day = SunCalc.getTimes(date, userCoordinates.lat, userCoordinates.lng);
  // new report initializer:
  
  // Add asr calculation time:
  function getAsrTime() {
    let date = new Date();
    let day = SunCalc.getTimes(date, userCoordinates.lat, userCoordinates.lng);
    let noon = SunCalc.getPosition(day["solarNoon"], userCoordinates.lat, userCoordinates.lng);
    let shadowMethod =
    (Math.atan(1 / (1 / Math.tan(noon['altitude']) + 1)) * 180) / Math.PI;
    let shadowMethodHanafi =
    (Math.atan(1 / (1 / Math.tan(noon['altitude']) + 2)) * 180) / Math.PI;
    return shadowMethodHanafi;
  }

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
  $("#todayDateIs").html(
    date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
  );
  $("#geoLocationLat").html((userCoordinates.lat).toFixed(4));
  $("#geoLocationLong").html((userCoordinates.lng).toFixed(4));
  // Fasting time (-18' degree):
  $("#fasting").html(formatTime(day.nightEnd));
  // Fajr time starts (-17' degree):
  $("#fajr").html(formatTime(day.fajrStart));
  // add recommended time fajr:
  $("#fajrRecommendation").html(formatTime(day.nauticalDawn));
  $("#fajrRecommendation").append('<br>');
  $('<span class="description"> — ' +  formatTime(day.dawn) + '</span>').appendTo('#fajrRecommendation');
  // Sunrise start time (fajr ends)
  // there is one minute additional time for safety reasons:
  let sunriseSafetyTime = new Date(day.sunrise);
  sunriseSafetyTime.setMinutes(day.sunrise.getMinutes() - 1);
  $("#sunriseStart").html(formatTime(sunriseSafetyTime));

  // Sunrise end time (ishroq salah starts)
  // there is one minute additional time for safety reasons:
  let sunriseEndSafetyTime = new Date(day.sunriseEnd);
  sunriseEndSafetyTime.setMinutes(day.sunriseEnd.getMinutes() + 1);
  $("#sunriseStart").append('<br>');
  $('<span class="description"> — ' +  formatTime(sunriseEndSafetyTime) + '</span>').appendTo('#sunriseStart');

  // Choshgoh time starts (Duhaa salah time)
  $("#choshgoh").html(formatTime(day.goldenHourEnd));
  $("#choshgoh").append('<br>');
  $('<span class="description"> — ' +  formatTime(day.doNotUse) + '</span>').appendTo('#choshgoh');
  // Choshgoh time starts (Duhaa salah time)
  $("#noon").html(formatTime(day.solarNoon));

  // Sunrise end time (ishroq salah starts)
  // there is three minutes additional time for safety reasons:
  let noonSafetyTime = new Date(day.solarNoon);
  noonSafetyTime.setMinutes(day.solarNoon.getMinutes() + 3);
  $("#dohr").html(formatTime(noonSafetyTime));

  // Asr time ends:
  $("#asr").html(formatTime(day.asrHanafiy));
  $("#asr").append('<br>');
  $('<span class="description"> — ' +  formatTime(day.goldenHour) + '</span>').appendTo('#asr');
  
  // Sunset start time:
  $("#sunset").html(formatTime(day.sunsetStart));
  
  $("#sunset").append('<br>');
  $('<span class="description"> — ' +  formatTime(day.sunset) + '</span>').appendTo('#sunset');

  // Maghrib time:
  // Sunset ends time (maghrib starts)
  // there is one minutes additional time for safety reasons:
  let sunsetSafetyTime = new Date(day.sunset);
  sunsetSafetyTime.setMinutes(day.sunset.getMinutes() + 1);
  $("#maghrib").html(formatTime(sunsetSafetyTime));
  $("#maghrib").append('<br>');
  $('<span class="description"> — ' +  formatTime(day.dusk) + '</span>').appendTo('#maghrib');
  // Night starts time:
  $("#night").html(formatTime(day.night));
  $("#night").append('<br>');
  $('<span class="description"> — ' +  formatTime(day.nadir) + '</span>').appendTo('#night');
  // Night nadir time:
}
