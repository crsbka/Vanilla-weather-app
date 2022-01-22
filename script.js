let apiKey = "c0d89ac9b3417fc5f06ed2c347a7a787";
let celTemp = 0;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(date) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let dayWeek = days[date.getDay()];

    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    return `${dayWeek}, ${hours}:${minutes}`;
}

let dateEl = document.querySelector("#current-date");
let currentTime = new Date();
dateEl.innerHTML = formatDate(currentTime);


//Search btn(when input the city name and click the btn-> API is calling and as a result update an HTML)
function getWeatherByInput(event) {
    event.preventDefault();

    let searchInput = document.querySelector("#city-input");

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric&appid=${apiKey}`;
    // common function call
    getApiResultAndUpdateHtml(apiUrl);
}

let searchCityButton = document.querySelector("#search-button");
searchCityButton.addEventListener("click", getWeatherByInput);

//Current location btn(when click the btn-> getCurrentPosition function runs and show position->then runs onCurrentPositionIdentified function)
function getWeatherByCurrentLocation(event) {
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(onCurrentPositionIdentified);
}

let currentCityButton = document.querySelector("#current-button");
currentCityButton.addEventListener("click", getWeatherByCurrentLocation);

//when current position identified run this function which get geolocation and as a result update an HTML
function onCurrentPositionIdentified(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    getApiResultAndUpdateHtml(apiUrl);
}

function getApiResultAndUpdateHtml(apiUrl) {
    axios.get(apiUrl).then(updateWeatherInfo);
}

function getForecast(coordinates) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
    console.log(response.data.daily);
    let forecastElement = document.querySelector("#forecast");

    let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let forecastHTML = `<div class="row">`;

    days.forEach(function(day){
        forecastHTML = forecastHTML +
         `<div class="col-2">
        <div class="weekdays">${day}</div>
        <i class="fas fa-cloud-sun icon float-center"></i>
        <div class="max-min-temp-forecast">
            <span class="max-temp">18°</span>
            <span class="min-temp">7°</span>
        </div>
    </div>`;
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function updateWeatherInfo(response) {
    //replacing h2 city/place with new value
    let place = response.data.name;
    let h2 = document.querySelector("h2");
    h2.innerHTML = place;

    //feels like value
    let feelsLike = Math.round(response.data.main.feels_like);
    let feelsLikeTemp = document.querySelector("#feels-like-value");
    feelsLikeTemp.innerHTML = `${feelsLike}°C`;

    //wind km/h
    let wind = Math.round(response.data.wind.speed);
    let windValue = document.querySelector("#wind");
    windValue.innerHTML = `${wind}km/h E`;

    //pressure
    let airPressure = Math.round(response.data.main.pressure);
    let pressure = document.querySelector("#pressure");
    pressure.innerHTML = `${airPressure}hPa`;

    //humidity %
    let humidityValue = response.data.main.humidity;
    let humid = document.querySelector("#humidity");
    humid.innerHTML = `${humidityValue}%`;

    //weather current conditions/descriptions
    let weatherDescription = response.data.weather[0].description;
    let weatherDescript = document.querySelector("#weather-description");
    weatherDescript.innerHTML = capitalizeFirstLetter(weatherDescription);

    //main big temp (bottom)
    let temp = Math.round(response.data.main.temp);
    let mainTemp = document.querySelector("#main-temperature");
    mainTemp.innerHTML = temp;
    celTemp = temp;

    getForecast(response.data.coord);

    //Weather icon

    let iconElement = document.querySelector("#main-icon");
    iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

}

//Challenge 3

function showCelTemp() {
    let tempSpan = document.querySelector("#main-temperature");
    celsiusLink.classList.add("active");
    farenhLink.classList.remove("active");
    tempSpan.innerHTML = "" + celTemp;
}

function showFarTemp() {
    let tempSpan = document.querySelector("#main-temperature");
    celsiusLink.classList.remove("active");
    farenhLink.classList.add("active");
    let farTemp = Math.round((celTemp * 9) / 5 + 32);
    tempSpan.innerHTML = "" + farTemp;
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelTemp);

let farenhLink = document.querySelector("#fahrenheit-link");
farenhLink.addEventListener("click", showFarTemp);
