import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
// import './App.css'

function App() {

  
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');


  const handleSearch = () => {
    setError('');
    setCurrentWeather(null);
    setForecast(null);
    fetchCurrentWeather();
    fetchForecast();
  }

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
  }

  const fetchCurrentWeather = async() => {
    if(!city) return;

    if(!navigator.onLine) {
      setError('No internet connection.');
      return;
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    try {
      const response = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
      handleApiErrors(response);
      const data = await response.json();
      setCurrentWeather(data);
    } catch(error) {
      setError(error.message);
    }
  }

  const fetchForecast = async () => {
    if(!city) return;

    if(!navigator.onLine) {
      setError('No internet connection.');
      return;
    }
    
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
      handleApiErrors(response);
      const data = await response.json();
      setForecast(data);
      console.log(data)

    } catch(error) {
      setError(error.message);
    }
  }

  
  return (
    <div className='app-container'>

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

          </ul>
        </aside>
        <main className='weather-card'>
          
        </main>
      </div>  

    </div>
  )
}

export default App
