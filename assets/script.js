$(document).ready(function () {


const APIKEY = "73eee7d40a8bca02f06afa438e49bb05";
var CURRENTDAY = moment().format("(MM/DD/YYYY");
var cityFormEl = $("#city-name");
var cityInputEl = $("#city-input");
var cityDisplayEl = $("#city-display");
var tempOutput = $("#temp-output");
var windOutput = $("#wind-output");
var humidityOutput = $("#humidity-output");
var uvOutput = $("#uv-output");
var pastSearches = $("#past-searches");

// search history
var viewSearchHistory = localStorage.getItem("viewSearchHistory");
if (!viewSearchHistory){
var history = [];
} 
else {
    var history = [];
    history = JSON.parse(viewSearchHistory);
}

if (history.length >= 1) {
    for (let i=0; i < history.length; i++) {
        var multiSearchBtn = $("<button>");
        multiSearchBtn.addClass("init-button btn btn-secondary w-100 my-2");
        multiSearchBtn.text(history[i]);
        pastSearches.append(multiSearchBtn);
    }
}

var initButton = $(".init-button");

// 5 day forecast day
var day1 = $("#day1");
var day2 = $("#day2");
var day3 = $("#day3");
var day4 = $("#day4");
var day5 = $("#day5");

function createButton(selectedCity) {
    // this fuction will be used to create a button which can be pressed and searched again.
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    console.log(searchHistory);
    console.log($.inArray(selectedCity,searchHistory));
    var searchCityBtn = $("<button>");

    if ($.inArray(selectedCity,searchHistory) == -1) {
        console.log(searchCityBtn);

        searchCityBtn.text(selectedCity);
        searchCityBtn.addClass("btn btn-secondary w-100 my-2");
        pastSearches.append(searchCityBtn);
        history.push(selectedCity);
        console.log(history);

        localStorage.setItem("searchHistory",JSON.stringify(history));
    }

    searchCityBtn.click(function() {
        var newCity = searchCityBtn.text();
        getQuery(newCity);
        cityDisplayEl.text(newCity + " " + CURRENTDAY);
    });

}

function displayForecast(secondApiCallData){
    var uvIndexData = Math.round(secondApiCallData.current.uvi);
    console.log(uvIndexData);
    console.log(typeof uvIndexData);
    uvOutput.text(uvIndexData);
    uvOutput.removeClass();

    if (uvIndexData == 0 || uvIndexData <= 3) {
        uvOutput.addClass("uv-low");
    }
    else if (uvIndexData > 3 && uvIndexData <= 5){
        uvOutput.addClass("uv-moderate");
    }
    else if (uvIndexData > 5 && uvIndexData <= 7){
        uvOutput.addClass("uv-high");
    }
    else if (uvIndexData > 7 && uvIndexData <= 10){
        uvOutput.addClass("uv-veryhigh");
    }
    else {
        uvOutput.addClass("uv-extreme");
    }

    // Have to create the 5 day forecast.



    for (let i=1; i<6; i++) {

        var daySelect = eval("day" + i);
        // console.log(daySelect);
        // console.log(typeof daySelect);

        var date = moment().add(i,"days").format("M/D/YYYY");
        var futureTemp = secondApiCallData.daily[i].temp.day;
        // console.log(futureTemp);
        var futureWind = secondApiCallData.daily[i].wind_speed;
        var futureHumidity = secondApiCallData.daily[i].humidity;
        var futureWeatherIcon = secondApiCallData.daily[i].weather[0].main;
        // console.log(futureWeatherIcon);
        var futureDate = $("<li>");
        futureDate.text(date);
        // console.log(futureDate);
        daySelect.append(futureDate);

        var forecastTemp = $("<li>");
        forecastTemp.text("Temp: " + futureTemp + "℉");
        // console.log(forecastTemp);
        daySelect.append(forecastTemp);

        var forecastWind = $("<li>");
        forecastWind.text("Wind: " + futureWind + " MPH");
        daySelect.append(forecastWind);

        var forecastHumid = $("<li>");
        forecastHumid.text("Humidity: " + futureHumidity + "%");
        daySelect.append(forecastHumid);

        var weatherImg = $("<img>");
    
        if (futureWeatherIcon === "Clear") {
            weatherImg.attr("src", "./assets/images/clear_img.png");
        }
        else if (futureWeatherIcon === "Rain" || futureWeatherIcon === "Drizzle") {
            weatherImg.attr("src", "./assets/images/rain_img.png");
        }
        else if (futureWeatherIcon === "Snow") {
            weatherImg.attr("src", "./assets/images/snow_img.png")
        }
        else if (futureWeatherIcon === "Clouds") {
            weatherImg.attr("src", "./assets/images/clouds_img.png")
        }
        else if (futureWeatherIcon === "Thunderstorm") {
            weatherImg.attr("src", "./assets/images/tstorm_img.png")
        }
        else {
            weatherImg.attr("src", "./assets/images/else_img.png")
        }
        daySelect.append(weatherImg);
    }
}

// Displaying weather data from ONE call APi
function displayWeather(firstApiCallData) {
    cityInputEl.val("");
    var temp = firstApiCallData.main.temp;
    var wind = firstApiCallData.wind.speed;
    var humidity = firstApiCallData.main.humidity;
    console.log(temp);
    console.log(wind);
    console.log(humidity);

    tempOutput.text("Temp: " + temp + "℉");
    windOutput.text("Wind: " + wind + " MPH");
    humidityOutput.text("Humidity: " + humidity + " %");
    console.log(tempOutput);
    console.log(windOutput);
    console.log(humidityOutput);

    var latitude = firstApiCallData.coord.lat;
    var longitude = firstApiCallData.coord.lon;
    console.log(latitude);
    console.log(longitude);

    secondApiCall(latitude,longitude);
}


// Second API CALL  for 5 day forecast and UV INDEX
function secondApiCall(latitude, longitude) {
    var secondCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKEY;
    console.log(secondApiCall);

    fetch(secondCall)
    .then(function(response){
        console.log(response);
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(data){
        console.log(data);
        displayForecast(data);
    })
    .catch(function(err){
        console.log(err);
    })
}


function getQuery(selectedCity) {
    event.preventDefault(); 
    day1.text("");
    day2.text("");
    day3.text("");
    day4.text("");
    day5.text("");

    // console.log(selectedCity);

    if (!selectedCity) {
        alert("ENTER CITY NAME");
        return;
    }

    createButton(selectedCity);
// ONE API CALL for current weather 
    var firstApiQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + selectedCity + "&appid=" + APIKEY + "&units=imperial";
    console.log(firstApiQuery);

    fetch(firstApiQuery)
    .then(function(response){
        if (response.ok) {
           console.log(response);
           console.log(response.ok);
           return response.json();
        }
    })
    .then(function(data){
        console.log(data);
        displayWeather(data);
    })
    .catch(function(err){
        console.log(err);
    })
}

cityFormEl.on("submit", function(){
    var selectedCity = cityInputEl.val().trim();
    getQuery(selectedCity);
    cityDisplayEl.text(cityInputEl.val() + " " + CURRENTDAY);
});

initButton.on("click", function(){
    var cityName = $(this).text();
    getQuery(cityName);
    cityDisplayEl.text(cityName + " " + CURRENTDAY);
})

})


















