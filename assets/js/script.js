var currentWeather = $('.current-weather');
var fiveDayForecast = $('.five-day-forecast');
var form = $('form');
var userInput = $('form input');
var apiKey = '134a7bca60f2f212f1b9faaf871be508';

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

function getData() {
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${userInput.val()}&appid=${apiKey}&units=metric`)
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
        });
        newFiveDayData.forEach(function(item) {
            displayFutureForecast(item);
        });
    });    
}

function serchCity() {
    form.submit(function (event) {
        event.preventDefault();
        var userCity = userInput.val();
        currentWeather.html('');
        fiveDayForecast.html('');
        $('.five-day-header').css('display', 'block');
        getData(); 
        userInput.val('');
    });
}

function init() {
    serchCity();
}

init();