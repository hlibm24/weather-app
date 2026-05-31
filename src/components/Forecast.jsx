import {useState} from 'react';

function Forecast ({data, showDetails, setShowDetails, getWeatherBackground}) {
    if(!data) return null;

    const groupByDays = (forecastData) => {
        const days = {};
        forecastData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if(!days[date]) {
                days[date] = [];
            }
            days[date].push(item);
        })
        return days;
    }

    const days = groupByDays(data);
    const daysArray = Object.values(days);

    const forecastList = daysArray.map(day => {
        let minTemp = Infinity;
        let maxTemp = -Infinity;
        let middayForecast = null;

        day.forEach(forecast => {
            const temp = forecast.main.temp;
            if(temp < minTemp) minTemp = temp;
            if(temp > maxTemp) maxTemp = temp;
            if(forecast.dt_txt.includes('12:00:00')) {
                middayForecast = forecast;
            };
        });

        let details = middayForecast || day[0];
        
        return {
            date: day[0].dt_txt.split(' ')[0].split('-').reverse().join('.'),
            minTemp: Math.round(minTemp),
            maxTemp: Math.round(maxTemp),
            icon: details.weather[0].icon,
            temp: Math.round(details.main.temp),
            feels_like: Math.round(details.main.feels_like),
            description: details.weather[0].description,
            humidity: details.main.humidity,
            wind: details.wind.speed.toFixed(1),
            pressure: details.main.pressure,
            visibility: (details.visibility / 1000).toFixed(1),
        };
    })
    

    return (
        <div className="forecast-section">
            <ul className="forecast-list">
                {forecastList.map(day => (
                    <li key={day.date} className="forecast-item">
                        <p>{day.date}</p>
                        <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.icon}/>
                        <p>{day.minTemp} °C / {day.maxTemp} °C</p>
                    </li>
                ))}    
            </ul>
            <button className="details-btn"
            onClick={() => setShowDetails(true)}>Details</button>

            {showDetails && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-details"
                        onClick={() => setShowDetails(false)}>X</button>
                        
                        {forecastList.map(day => (
                            <div className='detail-card'
                            key={day.date}
                            style={{background: getWeatherBackground(day?.description)}}>

                                <h4>{day.date}</h4>
                                <p>{day.description}</p>
                                <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                alt={day.icon}/>
                                <p>{day.temp}°C (feels like: {day.feels_like}°C)</p>
                                <p>Min {day.minTemp}°C / Max {day.maxTemp}°C</p>
                                <p>Humidity: {day.humidity}</p>
                                <p>Wind: {day.wind}</p>
                                <p>Pressure: {day.pressure}</p>
                                <p>Visibility: {day.visibility}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Forecast;