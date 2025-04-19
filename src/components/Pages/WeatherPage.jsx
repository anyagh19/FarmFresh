import React, { useState } from 'react';
import axios from 'axios';
import conf from '../../conf/conf';

const API_KEY = conf.WeatherKey;

const WeatherPage = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState('');

  const getWeather = async () => {
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
  
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
  
      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data.list.slice(0, 6)); // first 6 forecast intervals
      setError('');
    } catch (err) {
      setWeatherData(null);
      setForecastData([]);
      setError('City not found. Try again.');
    }
  };
  

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== '') {
      getWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">🌍 Weather Explorer</h1>
        <form onSubmit={handleSearch} className="flex gap-3 mb-6 justify-center">
          <input
            type="text"
            placeholder="Enter city name (e.g., Pune)"
            className="p-3 rounded-lg w-full text-black"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold">
            Search
          </button>
        </form>

        {error && <p className="text-red-200 text-center mb-4">{error}</p>}

        {weatherData && (
          <div className="bg-white text-black rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold">{weatherData.name}, {weatherData.sys.country}</h2>
            <p className="text-lg capitalize">{weatherData.weather[0].description}</p>
            <p className="text-3xl font-semibold mt-2">🌡 {weatherData.main.temp}°C</p>
            <div className="mt-2 space-y-1">
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind: {weatherData.wind.speed} m/s</p>
            </div>
          </div>
        )}

        {forecastData.length > 0 && (
          <div className="bg-white text-black rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">📅 5-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {forecastData.map((item, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="font-semibold text-sm">
                    {new Date(item.dt * 1000).toLocaleString()}
                  </p>
                  <p className="capitalize">{item.weather[0].description}</p>
                  <p>🌡 {item.main.temp}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
