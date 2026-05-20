function Forecast ({data}) {
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
        let icon = '';

        day.forEach(forecast => {
            const temp = forecast.main.temp;
            if(temp < minTemp) minTemp = temp;
            if(temp > maxTemp) maxTemp = temp;
            if(forecast.dt_txt.includes('12:00:00')) icon = forecast.weather[0].icon;
        });

        if(!icon) icon = day[0].weather[0].icon;

        return {
            date: day[0].dt_txt.split(' ')[0],
            minTemp: Math.round(minTemp),
            maxTemp: Math.round(maxTemp),
            icon: icon,
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
                        <p>{day.minTemp} / {day.maxTemp}</p>
                    </li>
                ))}    
            </ul>
            <button className="details-btn">Details</button>
        </div>
    )
}

export default Forecast;