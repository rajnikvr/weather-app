const currentHour = new Date().setMinutes(0,0,0);
const next24Hours = currentHour + 24 * 60 * 60 * 1000;
const displayHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0,0,0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;

    // Filtering 24 Hour Data
    const next24HoursData = hourlyData.filter(({ time }) => {
        const forecastTime = new Date(time).getTime();
    console.log(forecastTime);
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
displayHourlyForecast();