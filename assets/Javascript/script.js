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
} else {
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
    // console.log(searchHistory);
    // console.log($.inArray(selectedCity,searchHistory));
    var searchCityBtn = $("<button>");

    if ($.inArray(selectedCity,searchHistory) == -1) {
        // console.log(searchCityBtn);

        searchCityBtn.text(selectedCity);
        searchCityBtn.addClass("btn btn-secondary w-100 my-2");
        pastSearches.append(searchCityBtn);
        history.push(selectedCity);
        // console.log(history);

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
    // console.log(uvIndexData);
    // console.log(typeof uvIndexData);
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







// function weatherOutput(data) {
//     var icon = data.daily[0].weather[0].icon
//     console.log(icon)
//     var iconUrl = `http://openweathermap.org/img/wn/` + icon + `.png`;
//     weatherIcon.setAttribute('src', iconUrl);
   
//     var temperature = data.daily[0].temp.day;
//     cityTemp.textContent = "Temp: " + temperature + "℉";
//     console.log(temperature);

//     var wind = data.daily[0].wind_speed;
//     cityWind.textContent = "Wind: " + wind + "mph";
//     console.log(wind);
    
//     var humidity = data.daily[0].humidity;
//     cityHumid.textContent = "Humidity: " + humidity + "%";
//     console.log(humidity);
    
//     var uvIndex = data.daily[0].uvi;
//     cityUV.textContent = "UV Index: " + uvIndex;
//     console.log(uvIndex);

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

        // for(i = 0; i < 5; i++) {
        //     var day = data.daily[i];
        //     console.log(data.daily[i])
        //     day.forEach(day => {
        //     var dayContainer = document.createElement('div.container');
        //     var dayRow =  document.createElement('div.row');


        //     })
        // }

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

















