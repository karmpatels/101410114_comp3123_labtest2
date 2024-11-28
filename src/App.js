import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('Toronto'); // Setting the default city in the search bar as Toronto
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = 'ef9c897b782f922737e3b35d7858fd7f';

  const fetchWeather = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric` // Fetching the weather data from API Key
      );
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('City not found. Please try again.'); // Error message to display when no city is searched of found through API Key
      setWeatherData(null);
    }
  }, [city, API_KEY]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]); // Fetching weather data from callback function through API

  // Displaying weather data
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Forecast</h1>
        <div className="search-container">   
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>Search</button>
        </div>
        {error && <p className="error">{error}</p>}
        {weatherData && (
          <div className="weather-info">
            <div className="current-weather">
              <div className="details">
                <h2>
                  {weatherData.city.name}, {weatherData.city.country}
                </h2>
                <p>{new Date(weatherData.list[0].dt_txt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p>{weatherData.list[0].weather[0].description}</p>
              </div>
              <div className="temperature">
                {Math.round(weatherData.list[0].main.temp)}°C
              </div>
            </div>
            <div className="forecast-container">
              {weatherData.list
                .filter((_, index) => index % 8 === 0)
                .map((day, index) => (
                  <div className="forecast-day" key={index}>
                    <p>{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} // Fething icons from Web URL
                      alt={day.weather[0].description}
                    />
                    <p>{day.weather[0].description}</p>
                    <h3>{Math.round(day.main.temp)}°C</h3>
                  </div>
                ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;