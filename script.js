const input = document.getElementById('city-input');
const button = document.getElementById('search-button');
const getbutton = document.getElementById('get-location');

const cityName = document.getElementById('city-name');
const cityTime = document.getElementById('city-time');
const cityTemp = document.getElementById('city-temp');
const WeatherCondition = document.getElementById('weather-condition');
const WeatherImage = document.getElementById('weather-img');
const latitudeEl = document.getElementById('latitude');
const longitudeEl = document.getElementById('longitude');

const apiKey = "e2da93147aca4b04b3a23102243009"; // WeatherAPI key

// Get weather by city name
async function getDataByCity(city) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`
        );
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather by city:", error);
        alert("Failed to fetch weather data.");
    }
}

// Get weather by coordinates
async function getDataByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`
        );
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather by coordinates:", error);
        alert("Failed to fetch weather data.");
    }
}

// Display weather data
function displayWeather(result) {
    if (result.error) {
        alert("Weather data not found!");
        return;
    }

    cityName.innerText = `${result.location.name}, ${result.location.region}, ${result.location.country}`;
    cityTime.innerText = `Local Time: ${result.location.localtime}`;
    cityTemp.innerText = `Temperature: ${result.current.temp_c}°C`;
    WeatherCondition.innerText = result.current.condition.text;
    WeatherImage.src = result.current.condition.icon;
}

// Search by city
button.addEventListener("click", async () => {
    const value = input.value.trim();
    if (!value) {
        alert("Please enter a city name.");
        return;
    }
    const result = await getDataByCity(value);
    if (result) displayWeather(result);
});

// Get current location & fetch weather
getbutton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            latitudeEl.textContent = lat.toFixed(4);
            longitudeEl.textContent = lon.toFixed(4);

            const result = await getDataByCoords(lat, lon);
            if (result) displayWeather(result);
        }, () => {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
