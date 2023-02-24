//getting HTML elements

const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const locationEl = document.getElementById("location-name");
const uvindexEl = document.getElementById("uvindex");
const uvtextEl = document.getElementById("uv-text");
const humidityEl = document.getElementById("humidity");
const humiditytext = document.getElementById("humidity-text");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const windEl = document.getElementById("wind");
const windtext = document.getElementById("wind-status");
const VisibilityEl = document.getElementById("Visibility");
const Visibilitytext = document.getElementById("Visibility-status");
const airqualityEl = document.getElementById("airquality");
const airqualitytext = document.getElementById("airquality-status");
const cloudEl = document.getElementById("cloudcover");
const cloudtext = document.getElementById("cloudcover-status");
const arrowEl = document.getElementById("arrow");
const tempEl = document.getElementById("current-temp");
const bannerEl = document.getElementById("banner");
const cloudCondition = document.getElementById("cloud-status");
const rainCondition = document.getElementById("rain-status");
const weathercardEl = document.getElementById("weathercard");
const todaybtn = document.getElementById("todaybtn");
const weekbtn = document.getElementById("weekbtn");
const celsiusbtn = document.getElementById("celsius");
const fahrenheitbtn = document.getElementById("fahrenheit");
const searchEl = document.getElementById("searchEl");
const searchbtn = document.getElementById("searchbtn");
const tempunitEl = document.querySelectorAll(".temp-unit");

weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
currentUnit = "c";
hourlyorWeek = "week";

//getting time and date

setInterval(()=>{
    const today = new Date();
    hours = today.getHours();
    mins = today.getMinutes();
    day = today.getDay();
    ampm = hours < 12 ? "AM" : "PM";
    hours = hours > 12 ? hours%12 : hours;
    mins = mins < 10 ? "0" + mins : mins;
    hours = hours < 10 ? "0" + hours : hours;

    dateEl.innerText = weekdays[day]+",";
    timeEl.innerText = `${hours}:${mins}${ampm}`;
},1000);

//userlocation

function getLocation(){
    const locationApi = "https://geolocation-db.com/json/";
    fetch(locationApi,{
        method:"GET"
    }).then((response)=>
        response.json())
    .then((data)=>{
       //console.log(data);
       currentCity = data.city;
       console.log(currentCity);
      getWeatherData(currentCity,currentUnit,hourlyorWeek);
    })
}
getLocation();

//weatherdata

function getWeatherData(city,unit,hourlyorWeek){
     const apikey = "QHUCRPKVRC9PSNN7THRXEP8N7";
     const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apikey}&contentType=json`;
     fetch(url,{
        method:"GET"
     }).then((response)=>response.json())
     .then((data)=>{
        console.log(data);
        if(unit === "c"){
            tempEl.innerText = data.currentConditions.temp+"°C";
        }else{
            let fahrenheitval = ((data.currentConditions.temp*9)/5+32).toFixed(1);
            tempEl.innerText = fahrenheitval +"°F"
        }
        cloudCondition.innerText = `-"${data.currentConditions.conditions}"-`;
        locationEl.innerText = data.resolvedAddress;
        uvindexEl.innerText  = data.currentConditions.uvindex;
        humidityEl.innerText = data.currentConditions.humidity + "%";
        windEl.innerText = data.currentConditions.windspeed;
        VisibilityEl.innerText = data.currentConditions.visibility;
        cloudEl.innerText = data.currentConditions.cloudcover + "%";
        winddirection = data.currentConditions.winddir;
        //console.log(winddirection)
        rainCondition.innerText = data.currentConditions.precip + "%";
        measureWindDirection(winddirection);
        measureUVindex(data.currentConditions.uvindex);
        measureHumidity(data.currentConditions.humidity);
        measureVisibility(data.currentConditions.visibility);
        measurewind(data.currentConditions.windspeed);
        measureCloudy(data.currentConditions.cloudcover);
        bannerEl.src = changeBanner(data.currentConditions.icon);
        let sunrise = data.currentConditions.sunrise
        sunriseEl.innerHTML = `<img src="/css/images/sunrise.png" alt="sunrise"> ${convertTime(sunrise)}AM`;
        let sunset = data.currentConditions.sunset;
        sunsetEl.innerHTML = `<img src="/css/images/sunset.png" alt="sunset"> 0${convertTime(sunset)}PM`;
        if(hourlyorWeek === "hourly"){
            updateWeather(data.days[0].hours,unit,"day")
        }else{
          updateWeather(data.days,unit,"week")
        }
     }).catch((err)=>{
      alert("City Not Found in Our Database");
     });
};

//search city
searchbtn.addEventListener("click",searchCity);
function searchCity(){
  let cityLocation = searchEl.value;
  if(cityLocation){
    currentCity = cityLocation;
    getWeatherData(currentCity,currentUnit,hourlyorWeek);
  }
  searchEl.value = ""
}

//KEYPRESS event

searchEl.addEventListener("keypress",(e)=>{
  if(e.key == "Enter"){
    searchCity()
  }
});

//update weather data 

function updateWeather(data,unit,type){
  weathercardEl.innerHTML = "";
  let day = 0;
  let numofCards = 0;
  if(type === "day"){
    numofCards = 24; //if hourly output
  }else{
    numofCards = 7; //if days output
  }
  for(let i=0;i<numofCards;i++){
    let card = document.createElement("div");
    card.classList.add("weather-cards");
    //if hourly time
    let dayName = gethourly(data[day].datetime);
    //if weekly
    if(type === "week"){
      dayName = getdaysofweek(data[day].datetime);
      //console.log(data[day].datetime);
    }
    let daytemp = data[day].temp;
    if(unit === "f"){
      daytemp = celsiusToFahrenheit(data[day].temp);
    }
    let icons = data[day].icon;
    //console.log(icons)
    let iconSrc = changeBanner(icons);
    let tempUnit = "°C";
    if(unit == "f"){
     tempUnit = "°F"
    }
    card.innerHTML = `
               <p class="day-name">${dayName}</p>
               <div class=".card-icon">
               <img src=${iconSrc} alt="icon" id="cardimg">
               </div>
               <div class="cardtemp">
               <p class="temp">${daytemp}</p>
               <span class="temp-unit">${tempUnit}</span>
               </div>`

               weathercardEl.appendChild(card);
               day++;
  }
}




//celsius to fahrenheit

function celsiusToFahrenheit(tempval){
   return ((tempval*9)/5+32).toFixed(1); 
}


//measure UV index 

function measureUVindex(uvindex) {
    if(uvindex <= 2){
        uvtextEl.innerText = "Low";
        uvtextEl.style.color = "#00cb03";
    }else if(uvindex <= 5){
        uvtextEl.innerText = "Moderate";
        uvtextEl.style.color = "#00cb03";
    }else if(uvindex <= 7){
        uvtextEl.innerText = "High";
        uvtextEl.style.color = "red";
    }else if(uvindex <= 10){
        uvtextEl.innerText = "Very High";
        uvtextEl.style.color = "red";
    }else{
        uvtextEl.innerText = "Extreme";
        uvtextEl.style.color = "red";
    }
};

//measure Humidity


function measureHumidity(humidityvalue){
    if(humidityvalue <= 30){
        humiditytext.innerText = " Comfortable";
        humiditytext.style.color = "#00cb03";
    }else if(humidityvalue <= 70){
        humiditytext.innerText = "Moderate";
        humiditytext.style.color = "#00cb03";
    }else{
        humiditytext.innerText = "High humid";
        humiditytext.style.color = "red";
    }
};

//measure visibility

function measureVisibility(visibilityValue){
    if(visibilityValue <= 0.3){
        Visibilitytext.innerText = "Dense Fog";
        Visibilitytext.style.color = "red"
    }else if(visibilityValue <= 0.16){
        Visibilitytext.innerText = "Moderate Fog";
        Visibilitytext.style.color = "red";
    }else if(visibilityValue <= 0.35){
        Visibilitytext.innerText = "Light Fog";
        Visibilitytext.style.color = "orange";
    }else if(visibilityValue <= 1.13){
        Visibilitytext.innerText = "Very Light Fog";
        Visibilitytext.style.color = "orange";
    }else if(visibilityValue <= 2.16){
        Visibilitytext.innerText = "Light Mist";
        Visibilitytext.style.color = "orange"
    }else if(visibilityValue <= 5.4){
        Visibilitytext.innerText = "Very Light Mist";
        Visibilitytext.style.color = "#00cb03";
    }else if(visibilityValue <= 10.8){
        Visibilitytext.innerText = "Clear Air";
        Visibilitytext.style.color = "#00cb03";
    }else{
        Visibilitytext.innerText = "Very Clear Air";
        Visibilitytext.style.color = "#00cb03";
    }
}


//measure wind

function measurewind(windvalue){
  if(windvalue < 11){
    windtext.innerText = "Light breeze";
    windtext.style.color = "#00cb03";
  }else if(windvalue <= 29){
    windtext.innerText = "Moderate breeze";
    windtext.style.color = "#00cb03";
  }else if(windvalue <= 49){
    windtext.innerText = "Strong breeze";
    windtext.style.color = "#00cb03";
  }else{
    windtext.innerText = "Gale";
    windtext.style.color = "red"
  }
}


//measure winddirection

function measureWindDirection(windstatus){
    airqualitytext.style.color = "#00cb03"
    if (windstatus>11.25 && windstatus<33.75){
        airqualitytext.innerText = "NNE";
        arrowEl.style.transform = `rotate(${windstatus})`
      }else if (windstatus>33.75 && windstatus<56.25){
        airqualitytext.innerText = "ENE";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>56.25 && windstatus<78.75){
        airqualitytext.innerText = "E";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>78.75 && windstatus<101.25){
        airqualitytext.innerText = "ESE";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>101.25 && windstatus<123.75){
        airqualitytext.innerText = "ESE";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>123.75 && windstatus<146.25){
        airqualitytext.innerText = "SE";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>146.25 && windstatus<168.75){
        airqualitytext.innerText = "SSE";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>168.75 && windstatus<191.25){
        airqualitytext.innerText = "S";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>191.25 && windstatus<213.75){
        airqualitytext.innerText = "SSW";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>213.75 && windstatus<236.25){
        airqualitytext.innerText = "SW";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>236.25 && windstatus<258.75){
        airqualitytext.innerText = "WSW";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>258.75 && windstatus<281.25){
        airqualitytext.innerText = "W";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>281.25 && windstatus<303.75){
        airqualitytext.innerText = "WNW";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>303.75 && windstatus<326.25){
        airqualitytext.innerText = "NW";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else if (windstatus>326.25 && windstatus<348.75){
        airqualitytext.innerText = "NNW";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }else{
        airqualitytext.innerText = "N";
        arrowEl.style.transform = `rotate(${windstatus}deg)`
      }
}

//measure cloudy


function measureCloudy(cloudy){
    if(cloudy <= 30){
        cloudtext.innerText = "Mostly Sunny";
        cloudtext.style.color = "#00cb03";
    }else if(cloudy <= 70){
        cloudtext.innerText = "Partly Cloudy";
        cloudtext.style.color = "#00cb03";
    }else if(cloudy <= 90){
        cloudtext.innerText = "Mostly Cloudy";
        cloudtext.style.color = "#00cb03";
    }else{
        cloudtext.innerText = "Cloudy";
        cloudtext.style.color = "#00cb03";
    }
}

//convert time sunrise and sunset

function convertTime(time){
    //console.log(time)
    let sunhour = time.split(":")[0];
    //console.log(hour);
    let sunmin = time.split(":")[1];
    //console.log(sunmin);
    sunhour = sunhour > 12 ? sunhour - 12 : sunhour;
   
    let result = `${sunhour}:${sunmin}`
    return result;
}


//change weather data image

function changeBanner(icons){
   if(icons === "partly-cloudy-day"){
    return "css/images/cloudyday.png"
   }else if(icons === "partly-cloudy-night"){
   return  "css/images/cloudynight.png"
   }else if(icons === "rain"){
   return  "css/images/raining.png"
   }else if(icons === "clear-day"){
   return  "css/images/clearsky.png"
   }else if(icons === "clear-night"){
   return  "css/images/cloudynight.png"
   }else{
   return  "css/images/cloudy.png"
   }
}

//get week day from data

function getdaysofweek(date){
  let day = new Date(date);
  let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[day.getDay()];
}

//get hour from data

function gethourly(time){
  console.log(time)
  let hourly = time.split(":")[0];
  let minutes =  time.split(":")[1];
  if(hourly > 12){
    hourly = hourly - 12;
    return `${hourly}:${minutes}PM`
  }else {
    return `${hourly}:${minutes}AM`
  }
}


//change time button

todaybtn.addEventListener("click",()=>{
 changeTimeing("hourly")
  
});

weekbtn.addEventListener("click",()=>{
  changeTimeing("week")
});

//change time format

function changeTimeing(unit){
  if(hourlyorWeek != unit){
    hourlyorWeek = unit;
    if(unit === "hourly"){
      todaybtn.classList.add("active");
      weekbtn.classList.remove("active")
    }else{
      todaybtn.classList.remove("active");
      weekbtn.classList.add("active");
    }
    getWeatherData(currentCity,currentUnit,hourlyorWeek);
  }
}

//unit buttons

fahrenheitbtn.addEventListener("click",()=>{
    changeUnit("f");
});

celsiusbtn.addEventListener("click",()=>{
   changeUnit("c");
});

//change unit celsius to fahrenheit

function changeUnit(unit){
  if(currentUnit !== unit){
      currentUnit = unit; 
     tempunitEl.forEach((elem)=>{
        elem.innerText = `°${unit.toUpperCase()}`; 
      });
         if(unit === "C"){
          celsiusbtn.classList.add("active");
          fahrenheitbtn.classList.remove("active");
         }else{
          celsiusbtn.classList.remove("active");
          fahrenheitbtn.classList.add("active");
         }
         getWeatherData(currentCity,currentUnit,hourlyorWeek);
      }
  }
