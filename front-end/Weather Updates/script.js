const apiKey = "YOUR_OPENWEATHER_API_KEY"; 
const getWeatherBtn = document.getElementById("get-weather");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.getElementById("weather-info");

getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeatherBtn.click();
});

async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (data.cod !== 200) {
            alert("City not found!");
            return;
        }

        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const rain = data.rain ? data.rain["1h"] || 0 : 0;

        weatherInfo.style.display = "flex";
        weatherInfo.innerHTML = `
            <div class="weather-box temp"><p>🌡 Temperature</p><p>${temp}°C</p></div>
            <div class="weather-box humidity"><p>💧 Humidity</p><p>${humidity}%</p></div>
            <div class="weather-box rain"><p>🌦 Rain</p><p>${rain} mm</p></div>
        `;

        weatherInfo.style.opacity = 0;
        setTimeout(() => weatherInfo.style.opacity = 1, 100);

    } catch (error) {
        console.error(error);
        alert("Error fetching weather data");
    }
}
