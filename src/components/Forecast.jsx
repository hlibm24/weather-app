function Forecast ({data}) {

    const groupByDays = (forecastData) => {
        const days = {};
        forecastDate.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if(!days[date]) {
                days[date] = [];
            }
            days[date].push(item);
        })
        return days;
    }

    if(!data) return null;

    return (
        <div className="forecast-section">
            <ul className="forecast-list">
                <li className="forecast-item">
                    
                </li>
            </ul>
            <button className="details-btn">Details</button>
        </div>
    )
}

export default Forecast;