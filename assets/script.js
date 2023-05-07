//api key from the website
var apiKey = "5f9a058832023cc0703e92ac77bbfa5f";
// var apiURL = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";

//create an array to store the city informations
var cities = [];

//links the HTML elements
var cityForm = document.querySelector("#search-city-form");
var cityInput = document.querySelector("#city");
var currentWeather = document.querySelector("#current-weather");
var citySearch = document.querySelector("#city-searched");
var forecast = document.querySelector("#prediction")
var fiveDayForcast = document.querySelector("#forecast-container");
var previousSearch = document.querySelector("#searched-past-btn");

//submitting the form
function submitForm(event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city) {
        getWeather(city);
        get5Forcast(city);
        cities.unshift({city});
        cityInput.value = '';
    } else {
        alert('Please enter in the name of a city');
    }
    
    keepSearch();
    prevSearch(city);
}

//save the searched cities onto local storage
function keepSearch() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

//use the api key and url to get the weather for the city
function getWeather(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data){
            showWeather(data, city);
        })
    })
}

function showWeather(weather, cityName) {
    currentWeather.textContent = "";
    citySearch.textContent = cityName;

    //creating today element 
    var today = document.createElement('span');
    today.textContent = " (" + dayjs(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearch.appendChild(today);

    //add image of the weather onto the display
    var weatherImg = document.createElement("img")
    weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearch.appendChild(weatherImg);

    //add temp data and appends it to the current weather data
    var temprature = document.createElement("li");
    temprature.textContent = 'Temperature: ' + weather.main.temp + " °F";
    temprature.classList = 'list-item';
    currentWeather.appendChild(temprature);

    //add wind speed and appends it to the current weather data
    var wind = document.createElement("li");
    wind.textContent = '\nWind Speed: ' + weather.wind.speed + " MPH";
    wind.classList = 'list-item';
    currentWeather.appendChild(wind);

    //add humidity and appends it to the current weather data
    var humid = document.createElement("li");
    humid.textContent = '\nHumidity: ' + weather.main.humidity + " %";
    humid.classList = 'list-item';
    currentWeather.appendChild(humid);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;

    UVRays(lat, lon);
}

function UVRays(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            showUV(data);
            console.log(data);
        });
    });
    console.log(lat);
    console.log(lon);
}

function showUV(index) {
    var uvElement = document.createElement('div');
    uvElement.textContent = 'UV Index: ';
    uvElement.classList = 'list-item';

    var uvIndex = document.createElement("span");
    uvIndex.textContent = index.value;

    if(index.value <=2){
        uvIndex.classList = "favorable";
    }else if(index.value >2 && index.value<=8){
        uvIndex.classList = "moderate ";
    }
    else if(index.value >8){
        uvIndex.classList = "severe";
    };

    uvElement.appendChild(uvIndex);

    currentWeather.appendChild(uvElement);
}

function get5Forcast(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           fortuneFive(data);
        });
    });
}

function fortuneFive(weather) {
    fiveDayForcast.textContent = '';
    forecast.textContent = 'Five Day Forecast';

    var prediction = weather.list;
        for(var i = 5; i < prediction.length; i = i + 8){
            var dailyPrediction = prediction[i];

            var predictElement = document.createElement("div");
            predictElement.classList = 'card bg-primary text-light m-2';

            //add date
            var predictionDate = document.createElement("h5");
            predictionDate.textContent = dayjs.unix(dailyPrediction.dt).format("MMM D, YYYY");
            predictionDate.classList = 'card-header text-center';
            predictElement.appendChild(predictionDate);

            //add weather img
            var weatherImg = document.createElement('img');
            weatherImg.classList = 'card-body text-center';
            weatherImg.setAttribute('src', `https://openweathermap.org/img/wn/${dailyPrediction.weather[0].icon}@2x.png`);

            predictElement.appendChild(weatherImg);

            //add tempurature to the card
            var tempForcastSpan = document.createElement('span');
            tempForcastSpan.classList = 'card-body text-center';
            tempForcastSpan.textContent = 'Temp: ' + dailyPrediction.main.temp + ' °F';
            predictElement.appendChild(tempForcastSpan);

            //add windspeed
            var windSpan = document.createElement('span');
            windSpan.classList = 'card-body text-center';
            windSpan.textContent = 'Wind Speed: ' + dailyPrediction.wind.speed + " MPH";
            predictElement.appendChild(windSpan);


            //add humidity to the card
            var humidElement = document.createElement("span");
            humidElement.classList = 'card-body text-center';
            humidElement.textContent = 'Humidity: ' + dailyPrediction.main.humidity + ' %';
            predictElement.appendChild(humidElement);

            fiveDayForcast.appendChild(predictElement);

        }
}

function prevSearch(prevSearch) {
    var prevSearchElement = document.createElement("button");
    prevSearchElement.textContent = prevSearch;
    prevSearchElement.classList = 'd-flex w-100 btn-light border p-2';
    prevSearchElement.setAttribute('city-info', prevSearch);
    prevSearchElement.setAttribute('type', 'submit');

    previousSearch.prepend(prevSearchElement);
}

function prevSearchHand(event) {
    var city = event.target.getAttribute('city-info');
    if(city) {
        getWeather(city);
        get5Forcast(city);
    }
}

cityForm.addEventListener('submit', submitForm);
previousSearch.addEventListener('click', prevSearchHand);