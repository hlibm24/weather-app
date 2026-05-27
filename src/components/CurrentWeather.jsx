function CurrentWeather({data, onAddFavorite}) {

    if(!data) {
        return null;
    }

    return (
        <div className="currentWeather" >
            <button onClick={() => {
                console.log('Добавляем город:', data.name);
                onAddFavorite(data.name)}}>Star</button>
            <div className="main-info">
                <p>{data.name}</p>
                <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                 alt={data.weather[0].description} />
                <p>{data.weather[0].description}</p>
                <p>Temperature: {Math.round(data.main.temp)} °C</p>
                <p>Feels like: {Math.round(data.main.feels_like)} °C</p>
            </div>
            <div className="addit-info">
                <p>Humidity: {data.main.humidity}%</p>
                <p>Wind speed: {data.wind.speed.toFixed(1)} m/s</p>
                <p>Visibility: {(data.visibility / 1000)} Km</p>
                <p>Pressure: {data.main.pressure} hPa</p>
            </div> 
        </div>
    )
}

export default CurrentWeather;