var currentWeather = $('.current-weather');
var fiveDayForecast = $('.five-day-forecast');
var form = $('form');
var input = $('form input');
var apiKey = '134a7bca60f2f212f1b9faaf871be508';
var searchedCities = $('.searched-cities');
var fiveDayHeader = $('.five-day-header');

// get weather for city already in localStorage
function getPreviousCity() {
    var arr = getCities();
    $('.searched-city-paragraph').click(function() {
        currentWeather.html('');
        fiveDayForecast.html('');
        getData($(this).text(),arr);
    });
}

// display cities form localStorage
function displayCities(arr) {
    var arr = getCities();
    searchedCities.html('');
    arr.forEach(function(city) {
        searchedCities.append(`<p class="searched-city-paragraph">${city}</p>`);
    });
    getPreviousCity();
}

// save cities to localStorage
function saveCities(arr) {
    localStorage.setItem('cities',JSON.stringify(arr));
}

//get cities from localStorage
function getCities() {
    return JSON.parse(localStorage.getItem('cities')) || [];
}

// display current weather
function displayCurrentWeather(currentData) {
    currentWeather.append(`
        <div class="weather-container">
            <h3>${currentData.name} (${moment.unix(currentData.dt).format('DD/MM/YYYY')})</h3>
            <div class="weather-details-container">
                <div>
                    <p>Temp: ${currentData.main.temp} \u00B0C</p>
                    <p>Wind: ${currentData.wind.speed} KPH</p>
                    <p>Humidity: ${currentData.main.humidity}%</p>
                </div>
                <div>
                    <img src=https://openweathermap.org/img/w/${currentData.weather[0].icon}.png>
                </div>
            </div>
        </div>
    `);
}

// display 5-day forecast
function displayFutureForecast(fiveDayData) {
    fiveDayForecast.append(`
        <div class="weather-container">
            <h3>${moment.unix(fiveDayData.dt).format('DD/MM/YYYY')}</h3>
            <div class="weather-details-container">
                <div>
                    <p>Temp: ${fiveDayData.main.temp} \u00B0C</p>
                    <p>Wind: ${fiveDayData.wind.speed} KPH</p>
                    <p>Humidity: ${fiveDayData.main.humidity}%</p>
                </div>
                <div>
                    <img src=https://openweathermap.org/img/w/${fiveDayData.weather[0].icon}.png></p>
                </div>
            </div>
        </div>
    `);
}

// get data form openWeather API
function getData(city,cities) {
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(function(currentData) {
            var lat = currentData.coord.lat;
            var lon = currentData.coord.lon;
            displayCurrentWeather(currentData);
            return $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    }).then(function(fiveDayData) {
        var newFiveDayData = fiveDayData.list.filter(function(data) {
            if(moment.unix(data.dt).format('DD') !== moment().format('DD')) {
                return moment.unix(data.dt).add(1,'days').format('HH') === '09';           
            }
            fiveDayHeader.css('display', 'block');
            currentWeather.css('border', '1px solid #000');
        });
        newFiveDayData.forEach(function(item) {
            displayFutureForecast(item);
        });

        // check if city was searched before if not add to localStorage
        if(!cities.includes(city)) {
            cities.push(city.charAt(0).toUpperCase() + city.slice(1).toLowerCase());
            saveCities(cities);
            displayCities(cities);
        };
        
    // display error if city not found
    }).fail(function(err) {
        displayCities(cities);
        fiveDayHeader.css('display', 'none');
        currentWeather.css('border', 'none');
        currentWeather.append('<p>City not found please try again</p>');
    });    
}

// search for required city
function serchCity() {
    var cities = getCities();
    form.submit(function (event) {

        // check if user was checking the weather before
        event.preventDefault();

        // change user input to format first letter upper case rest letters in lower case
        var userCity = input.val().charAt(0).toUpperCase() + input.val().slice(1).toLowerCase();
        
        currentWeather.html('');
        fiveDayForecast.html('');

        // get data form openWeather API
        getData(userCity,cities);
        
        // clear user input 
        input.val('');

        // clear searched city div
        searchedCities.html('');
        
    });
    
    displayCities(cities);
}

function init() {
    serchCity();
    var cities = getCities();
    if(cities.length) {
        getPreviousCity();  
        displayCities();
    };
    searchedCities.click(function() {
        getPreviousCity();
        displayCities();
    });
}


init();