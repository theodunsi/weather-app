import "./style.css";

const form = document.getElementById("weather-form");
const submit = document.getElementById("submit");
const input = document.getElementById("search");

submit.addEventListener("click", function(e) {
    e.preventDefault();
    const value = input.value;
    getWeatherData(value);
})

console.log("JavaScript is working!");

function processWeatherData(data) {
    const currentTemp = data.currentConditions.temp;
    const conditions = data.currentConditions.conditions;
    const location = data.resolvedAddress;
    const humidity = data.currentConditions.humidity;
    const icon = data.currentConditions.icon;

    const highTemp = data.days[0].tempmax;
    const lowTemp = data.days[0].tempmin;

    return {
        temperature: currentTemp,
        conditions: conditions,
        location: location,
        humidity: humidity,
        icon: icon,
        high: highTemp,
        low: lowTemp
    };
}

async function getWeatherData(location) {
    const API_KEY = "9J6PHJVGT78L9JLU2DYJ8HJST";

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const weatherData = processWeatherData(data);

        if (!response.ok) {
            alert("something went wrong!")
        }
        else { console.log(weatherData); }
    }
    catch(error) {
        console.error("Error fetching weather:", error);
    }
}
