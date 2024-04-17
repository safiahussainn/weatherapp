document.getElementById('search').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
        const apiKey = 'ea5f34e3ae06d8f916dc3732eb6c2c24';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        // Fetch current weather data
        fetch(weatherUrl)
            .then((response) => response.json())
            .then((data) => {
                const weatherContainer = document.querySelector('.weather-container');
                const temperature = data.main.temp;
                const description = data.weather[0].description;
                const icon = data.weather[0].icon;

                const weatherHTML = `
                    <h2>Current Weather in ${city}</h2>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Description: ${description}</p>
                    <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
                `;

                weatherContainer.innerHTML = weatherHTML;
            })
            .catch((error) => {
                console.error('Error fetching current weather data:', error);
            });

        // Fetch 5-day hourly forecast data
        fetch(hourlyForecastUrl)
            .then((response) => response.json())
            .then((data) => {
                const forecastContainer = document.querySelector('.forecast-container');
                const hourlyForecastData = data.list;

                // Group hourly data by day
                const dailyForecast = {};

                hourlyForecastData.forEach((item) => {
                    const timestamp = item.dt * 1000;
                    const date = new Date(timestamp);
                    const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' });

                    if (!dailyForecast[dayKey]) {
                        dailyForecast[dayKey] = [];
                    }

                    dailyForecast[dayKey].push(item);
                });

                let forecastHTML = '';

                for (const dayKey in dailyForecast) {
                    forecastHTML += `<h3>${dayKey}</h3>`;

                    dailyForecast[dayKey].forEach((item) => {
                        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
                        const temperature = item.main.temp;
                        const description = item.weather[0].description;
                        const icon = item.weather[0].icon;

                        forecastHTML += `
                            <div class="forecast-item">
                                <p>${time}</p>
                                <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
                                <p>Temp: ${temperature}°C</p>
                                <p>${description}</p>
                            </div>
                        `;
                    });
                }

                forecastContainer.querySelector('.forecast').innerHTML = forecastHTML;
            })
            .catch((error) => {
                console.error('Error fetching 5-day hourly forecast data:', error);
            });
    }
});
