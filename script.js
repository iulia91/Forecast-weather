const iconElement = document.querySelector(".w-icon");
const descriptionElement = document.querySelector(".description");
const locationElement = document.querySelector(".current-data__location");
const timeElement = document.querySelector(".current-data__time");
const dateElement = document.querySelector(".current-data__date");
const tempElement = document.querySelector(".temp");
const windElement = document.querySelector(".wind");
const humElement = document.querySelector(".hum");
const notificationElement = document.querySelector(".notification");
const btnElement = document.getElementById("submit");
const searchElement = document.getElementById("search-bar");
const weatherForecastElement = document.getElementById("week-forecast");


const weather = {};

weather.temperature = {
    unit: "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const api_key = "436260f60bc58611ac26d263862ff2de";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}


function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.wind = data.wind.speed;
            weather.humidity = data.main.humidity;
        })
        .then(function () {
            displayWeather();
        });
}
function displayWeather() {
    iconElement.innerHTML = `<img src="images/${weather.iconId}.png"/>`;
    descriptionElement.innerHTML = `${weather.description}`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    windElement.innerHTML = `${weather.wind}km/h`;
    humElement.innerHTML = `${weather.humidity}<span>%</span>`;
}

const time = document.querySelector(".current-data__time");
const dateZ = document.querySelector(".current-data__date");
let currentUnit = "";
let hourlyorWeek = "";


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HoursFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";

    timeElement.innerHTML = hoursIn12HoursFormat + ":" + minutes + " " + `<span id="am-pm">${ampm}</span>`;

    dateElement.innerHTML = days[day] + "," + date + "" + months[month]

}, 1000);


getWeekForecastData()
function getWeekForecastData() {
    navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=7&appid=${api_key}&units=metric`)
            .then(res => res.json())
            .then(function (data) {
                console.log(data)
                weatherForecastElement.innerHTML = '';
                for (let i = 0; i < data.list.length; i++) {
                    let dayWeather = data.list[i];
                    let dayWeatherHtml = getDayWeatherHtml(dayWeather);
                    weatherForecastElement.appendChild(dayWeatherHtml);
                }
            })

    })
}

function getDayWeatherHtml(dayWeather) {
    let trElement = document.createElement("tr");
    trElement.class = "hour-forecast__row";
    trElement.innerHTML =`
                    <td style="width: 200px;">
                        <div class="hour-forecast__item" >
                            <div class="field">${dayWeather.dt_txt}</div>
                        </div>
                    </td>
                    <td style="width: 80px;">
                        <img src="images/${dayWeather.weather[0].icon}.png" style="height:80px" class="w-icon" />
                    </td>
                    <td>
                        <div class="hour-forecast__item">
                            <div class="field">Max</div>
                            <div>${Math.round(dayWeather.main.temp_max)} C</div>
                        </div>
                    </td>
                    <td> <div class="hour-forecast__item">
                            <div class="field">Min</div>
                            <div>${Math.round(dayWeather.main.temp_min)} C</div>
                        </div>
                    </td>
                    <td>
                        <div class="hour-forecast__item">
                            <div class="field">Wind</div>
                            <div>${Math.round(dayWeather.wind.speed)}<span class="">km/h</span></div>
                        </div>
                    </td>
                    <td>
                        <div class="hour-forecast__item">
                            <div class="field">Humidity</div>
                            <div>${dayWeather.main.humidity} %</div>
                        </div>
                    </td>
`
    return trElement;
}

// Search btn


function checkCity(city) {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    fetch(`${url}`)
        .then(res => res.json())
        .then(function (data) {
            console.log(data);
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.wind = data.wind.speed;
            weather.humidity = data.main.humidity;
        })
        .then(function () {
            displayWeather();
        });

    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=7&appid=${api_key}&units=metric`)
        .then(res => res.json())
        .then(function (data) {
            console.log(data)
            weatherForecastElement.innerHTML = '';
            for (let i = 0; i < data.list.length; i++) {
                let dayWeather = data.list[i];
                let dayWeatherHtml = getDayWeatherHtml(dayWeather);
                weatherForecastElement.appendChild(dayWeatherHtml);
            }
        })
}

btnElement.addEventListener('click', () => {
    checkCity(searchElement.value);

});
// Theme changing

var currentTime = new Date().getHours();
if (document.body) {
    if (7 <= currentTime && currentTime < 20) {
        document.body.background = "https://files.all-free-download.com//downloadfiles/wallpapers/1920_1200/bright_day_light_8134.jpg";

    }
    else {
        document.body.background = "https://static.vecteezy.com/system/resources/previews/009/302/766/original/silhouette-landscape-with-fog-forest-pine-trees-mountains-illustration-of-night-view-mist-black-and-white-good-for-wallpaper-background-banner-cover-poster-free-vector.jpg?fbclid=IwAR2Jrdp67WfQlNxaJ-qrRui3oqwIxoK6NNDCNmXLXHTefBuoqewndEzWE1Y";
    }
}
