// src/components/WeatherWidget.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiDayHaze, WiHumidity, WiStrongWind } from 'react-icons/wi';
import { FiThermometer, FiRefreshCw } from "react-icons/fi";
import { BsSearch } from "react-icons/bs";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Delhi");
  const [searchInput, setSearchInput] = useState("Delhi");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // IMPORTANT: Replace with your own free API key from OpenWeatherMap
  const API_KEY = "5c7392ef28574b2b8af2b8bdef2e8439"; 

  const getWeather = useCallback(async () => {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      setError("API Key is missing.");
      console.error("OpenWeatherMap API Key is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      console.error("Error fetching weather data:", err);
    } finally {
      setLoading(false);
    }
  }, [city, API_KEY]);

  useEffect(() => {
    getWeather();
  }, [getWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(searchInput);
  };

  const getWeatherIcon = (weatherId) => {
    const iconSize = 80;
    if (weatherId >= 200 && weatherId < 300) return <WiThunderstorm size={iconSize} />;
    if (weatherId >= 300 && weatherId < 600) return <WiRain size={iconSize} />;
    if (weatherId >= 600 && weatherId < 700) return <WiSnow size={iconSize} />;
    if (weatherId >= 700 && weatherId < 800) return <WiDayHaze size={iconSize} />;
    if (weatherId === 800) return <WiDaySunny size={iconSize} />;
    if (weatherId > 800) return <WiCloudy size={iconSize} />;
    return <WiDaySunny size={iconSize} />;
  }

  return (
    <div className="absolute top-10 right-4 text-white p-4 rounded-2xl bg-black/30 dark:bg-black/40 backdrop-blur-lg border border-white/10 w-72 z-10 shadow-lg">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search city..."
          className="flex-grow bg-white/10 rounded-md px-3 py-1.5 text-sm placeholder-white/50 outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button type="submit" className="p-2 bg-white/10 rounded-md hover:bg-teal-500 transition-colors">
          <BsSearch />
        </button>
      </form>

      {loading && <p className="text-center">Loading weather...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}
      
      {weather && !loading && (
        <div className="flex flex-col gap-4">
          {/* Main Display */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
            <div className="flex justify-center items-center -my-2">
                {getWeatherIcon(weather.weather[0].id)}
                <p className="text-6xl font-bold">{Math.round(weather.main.temp)}°C</p>
            </div>
            <p className="text-lg capitalize -mt-2">{weather.weather[0].description}</p>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-white/10 p-2 rounded-lg">
              <FiThermometer className="mx-auto mb-1" size={20} />
              <p className="font-semibold">{Math.round(weather.main.feels_like)}°</p>
              <p className="text-xs opacity-70">Feels Like</p>
            </div>
            <div className="bg-white/10 p-2 rounded-lg">
              <WiHumidity className="mx-auto" size={24} />
              <p className="font-semibold">{weather.main.humidity}%</p>
              <p className="text-xs opacity-70">Humidity</p>
            </div>
            <div className="bg-white/10 p-2 rounded-lg">
              <WiStrongWind className="mx-auto" size={24} />
              <p className="font-semibold">{weather.wind.speed} m/s</p>
              <p className="text-xs opacity-70">Wind</p>
            </div>
          </div>
          
          {/* Refresh Button */}
          <button onClick={getWeather} className="mt-2 text-xs flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;