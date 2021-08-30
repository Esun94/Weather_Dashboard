const ApiKey = "73eee7d40a8bca02f06afa438e49bb05";
var searchBtn = document.getElementById("search-btn");
var citySearchInput = document.getElementById("search-input");
var cityName = document.getElementById("user-city");
var cityTemp = document.getElementById("user-temp");
var cityWind = document.getElementById("user-wind");
var cityHumid = document.getElementById("user-humid");
var cityUV = document.getElementById("user-uv");
var weatherIcon = document.getElementById("current-img");


function weatherOutput(data) {
    var icon = data.daily[0].weather[0].icon
    console.log(icon)
    var iconUrl = `http://openweathermap.org/img/wn/` + icon + `.png`;
    weatherIcon.setAttribute('src', iconUrl);
   
    var temperature = data.daily[0].temp.day;
    cityTemp.textContent = "Temp: " + temperature + "℉";
    console.log(temperature);

    var wind = data.daily[0].wind_speed;
    cityWind.textContent = "Wind: " + wind + "mph";
    console.log(wind);
    
    var humidity = data.daily[0].humidity;
    cityHumid.textContent = "Humidity: " + humidity + "%";
    console.log(humidity);
    
    var uvIndex = data.daily[0].uvi;
    cityUV.textContent = "UV Index: " + uvIndex;
    console.log(uvIndex);

    // var icon = data.daily[1].weather[0].icon
    // console.log(icon)
    // var iconUrl = `http://openweathermap.org/img/wn/` + icon + `.png`;
    // weatherIcon.setAttribute('src', iconUrl);
    // var temperature = data.daily[1].temp.day;
    // cityTemp.textContent = "Temp: " + temperature + "℉";
    // console.log(temperature);
    // var wind = data.daily[1].wind_speed;
    // cityWind.textContent = "Wind: " + wind + "mph";
    // console.log(wind);
    // var humidity = data.daily[1].humidity;
    // cityHumid.textContent = "Humidity: " + humidity + "%";
    // console.log(humidity);
    // var uvIndex = data.daily[1].uvi;
    // cityUV.textContent = "UV Index: " + uvIndex;
    // console.log(uvIndex);
    
}

// Current Weather API
function showWeatherData(data) {
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
    console.log(latitude);
    console.log(longitude);
    var OneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=` + latitude + `&lon=` + longitude + `&exclude=minutely,hourly,alerts&units=imperial&appid=${ApiKey}`;
    
    fetch(OneCall)
    .then(function (response) {
        console.log(response)
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        weatherOutput(data);
        // fiveDayForecast(data);

    })
}



searchBtn.addEventListener('click', function(event){
    event.preventDefault();
    console.log(citySearchInput.value)
    var currentWeatherCall = `https://api.openweathermap.org/data/2.5/weather?q=` + citySearchInput.value + `&appid=${ApiKey}`;
    fetch(currentWeatherCall)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        showWeatherData(data);
    })
    .catch(function(err) {
        alert("Wrong City Name!")
    })
});

















