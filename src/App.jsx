import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
// import './App.css'

function App() {

  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // fav list code
  const addToFavs = (cityName) => {
    if (cityName && !favorites.includes(cityName)) {
      const newFavorites = [...favorites, cityName];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };
  };

  useEffect(()=> {
    const stored = localStorage.getItem('favorites');
    if(stored) {
      setFavorites(JSON.parse(stored));
    };
  }, []);

  const handleFavSearch = (cityName) => {
    setCity(cityName);
    handleSearch(cityName);
  };

  const removeFromFavList = (cityName) => {
    const updatedFavList = favorites.filter(city => city !== cityName);
    setFavorites(updatedFavList);
    localStorage.setItem('favorites', JSON.stringify(updatedFavList));
  }
  //

  const handleSearch = (cityName = city) => {
    setError('');
    setCurrentWeather(null);
    setForecast(null);
    setShowDetails(false);
    fetchCurrentWeather(cityName);
    fetchForecast(cityName);
  };

  const inputRef = useRef(null);
  useEffect(()=> {
    inputRef.current.focus();
  }, []);


  const handleApiErrors = (response) => {
    if(!response.ok) {
      switch(response.status) {
        case 404:
          throw new Error('City is not found.');
        case 401:
          throw new Error('The server does not respond.');
        case 429:
          throw new Error('Too many requests, try later.');
        default:
          throw new Error('Server issues, try later.');
      }
    }
  };

  const fetchCurrentWeather = async(cityName) => {
    if(!cityName) return;

    if(!navigator.onLine) {
      setError('No internet connection.');
      return;
    };

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    try {
      const response = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`)
      handleApiErrors(response);
      const data = await response.json();
      setCurrentWeather(data);
      console.log(data);

    } catch(error) {
      setError(error.message);
    }
  }

  const fetchForecast = async (cityName) => {
    if(!cityName) return;

    if(!navigator.onLine) {
      setError('No internet connection.');
      return;
    }
    
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`);
      handleApiErrors(response);
      const data = await response.json();
      setForecast(data);
      console.log(data);

    } catch(error) {
      setError(error.message);
    }
  }


  const getWeatherBackground = (description) => {
    if (!description) return 'linear-gradient(135deg, #ece9e6, #ffffff)';

    const desc = description.toLowerCase();

    if (desc.includes('clear')) return 'linear-gradient(135deg, #f5f7fa, #c3cfe2)';

    if (desc.includes('few clouds')) return 'linear-gradient(135deg, #e0eafc, #cfdef3)';
    if (desc.includes('scattered clouds')) return 'linear-gradient(135deg, #d3cce3, #e9e4f0)';
    if (desc.includes('broken clouds')) return 'linear-gradient(135deg, #bdc3c7, #2c3e50)';
    if (desc.includes('overcast clouds')) return 'linear-gradient(135deg, #616161, #9bc5c3)';

    if (desc.includes('light rain')) return 'linear-gradient(135deg, #7f9fbf, #4b79a1)';
    if (desc.includes('moderate rain')) return 'linear-gradient(135deg, #4b79a1, #283e51)';
    if (desc.includes('heavy')) return 'linear-gradient(135deg, #1e3c72, #2a5298)';
    if (desc.includes('rain')) return 'linear-gradient(135deg, #4b79a1, #283e51)';

    if (desc.includes('drizzle')) return 'linear-gradient(135deg, #8e9eab, #eef2f3)';

    if (desc.includes('thunderstorm')) return 'linear-gradient(135deg, #232526, #414345)';

    if (desc.includes('light snow')) return 'linear-gradient(135deg, #e6e9f0, #eef2f5)';
    if (desc.includes('snow')) return 'linear-gradient(135deg, #d9e2e8, #aebbc3)';
    if (desc.includes('heavy snow')) return 'linear-gradient(135deg, #b0c4de, #708090)';
    if (desc.includes('sleet')) return 'linear-gradient(135deg, #bdc3c7, #2c3e50)';

    if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) return 'linear-gradient(135deg, #c9d6df, #b3c7d4)';

    return 'linear-gradient(135deg, #ece9e6, #ffffff)';
  };


  return (
    <div className='app-container'
    style={{background: getWeatherBackground(currentWeather?.weather?.[0]?.description)}}>

      <div className='search-container'>
        <input type="text"
        placeholder='Enter city...'
        ref={inputRef}
        value={city}
        onChange={(e)=> setCity(e.target.value)}
        onKeyDown={(e)=> e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && 
      <div className='error-message'>{error}</div>
      }
      
      <div className='main-container'>
        <aside className='side-bar'>
          <ul className='favorites'>
            {favorites.map(favCity =>(
              <li key={favCity}>
                <span onClick={() => handleFavSearch(favCity)}>{favCity}</span>
                <button onClick={() => removeFromFavList(favCity)}>Delete</button>
              </li>
            ))}
          </ul>
        </aside>
        <main className='weather-card'>
          {currentWeather && <CurrentWeather
           data={currentWeather}
           onAddFavorite={addToFavs}/>}

          {forecast && <Forecast 
          data={forecast}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          getWeatherBackground={getWeatherBackground}/>}
        </main>
      </div>  

    </div>
  )
}

export default App
