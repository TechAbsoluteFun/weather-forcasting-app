document.addEventListener("DOMContentLoaded", function () {
    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const weatherData = document.getElementById("weatherData");
    const forecastChart = document.getElementById("forecastChart");

    // Replace with your OpenWeatherMap API key
    const apiKey = "9fada5888e1763a3220c3f59251b0e62";

    // Default city if geolocation fails
    const defaultCity = "Delhi";

    // Event listener for the search button
    searchBtn.addEventListener("click", () => {
        const cityName = cityInput.value.trim();
        if (cityName !== "") {
            getWeather(cityName);
        }
    });

    // Fetch weather data from OpenWeatherMap API
    function getWeather(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                displayCurrentWeather(data);
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            })
            .then((response) => response.json())
            .then((data) => {
                displayForecast(data);
            })
            .catch((error) => {
                console.error("Error fetching weather data: ", error);
            });
    }

    // Display current weather data
    function displayCurrentWeather(data) {
        weatherData.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <p>${new Date(data.dt * 1000).toLocaleDateString()}</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Temperature: ${data.main.temp}&deg;C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }

    // Display 7-day forecast
    function displayForecast(data) {
        forecastChart.innerHTML = "";
        for (let i = 0; i < data.list.length; i += 8) {
            const forecastItem = data.list[i];
            const date = new Date(forecastItem.dt * 1000).toLocaleDateString();
            const temperature = forecastItem.main.temp;
            const humidity = forecastItem.main.humidity;
            const weatherDescription = forecastItem.weather[0].description;

            const chartItem = document.createElement("div");
            chartItem.classList.add("chart-item");
            chartItem.innerHTML = `
                <h3>${date}</h3>
                <p>Temp: ${temperature}&deg;C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Weather: ${weatherDescription}</p>
            `;
            forecastChart.appendChild(chartItem);
        }
    }

    // Fetch weather data for the default city
    getWeather(defaultCity);
});
