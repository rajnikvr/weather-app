const searchInput = document.querySelector('.search-input');
const currentWeatherDiv = document.querySelector('.current-weather');
const locationButton = document.querySelector('.location-button');
const hourlyWeatherDiv = document.querySelector('.hourly-weather .weather-list');
const API_KEY = '2767774e94ff4934bcb50715240309';


const displayHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0,0,0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;

    // Filtering 24 Hour Data
    const next24HoursData = hourlyData.filter(({ time }) => {
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24Hours;
    });

    hourlyWeatherDiv.innerHTML = next24HoursData.map(item => {
        const temp = Math.floor(item.temp_c);
        const time = item.time.split(" ")[1].substring(0, 5);
        const icon = item.condition.icon;

        return `<li class="weather-item">
                        <p class="time">${time}</p>
                        <img src="${icon}" class="weather-icon">
                        <p class="temperature">${temp}°</p>
                    </li>`;
    }).join("");
    // console.log(hourlyWeatherHTML);
}

const getWeatherDetails = async (API_URL) => {
    window.innerWidth <= 768 && searchInput.blur();
    document.body.classList.remove('show-no-results')

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const temp = Math.floor(data.current.temp_c);
        const desc = data.current.condition.text;
        const icon = data.current.condition.icon;

        currentWeatherDiv.querySelector('.temperature').innerHTML = `${temp}<span>°C<span>`;
        currentWeatherDiv.querySelector('.description').innerText = desc;
        currentWeatherDiv.querySelector('.weather-icon').src = icon;

        const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour,]
        displayHourlyForecast(combinedHourlyData);

        searchInput.value = data.location.name;
    } catch (error) {
        console.log(error);
        document.body.classList.add('show-no-results')
    }
}

const setWeatherReq = (cityName) => {
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;
    getWeatherDetails(API_URL);
}

searchInput.addEventListener('keyup', (e) => {
    const cityName = searchInput.value.trim();

    if(e.key == "Enter" && cityName){
        // console.log(cityName);
        setWeatherReq(cityName);
    }
})

locationButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords;
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
        getWeatherDetails(API_URL);
        console.log(position);
    }, error => {
        alert('Location access denied. Please enable permissions to use this features!');
    })
});