import "./style.css";

const form = document.getElementById("weather-form");
const submit = document.getElementById("submit");
const input = document.getElementById("search");
const content = document.getElementById("main-content");
const toggle = document.getElementById("toggle");
let currentUnit = "F";
let tempElement = null;
let highTempElement = null;
let lowTempElement = null;
let storedWeatherData = null;


submit.addEventListener("click", function(e) {
    e.preventDefault();
    const value = input.value;
    getWeatherData(value);
})

toggle.addEventListener("click", () => {
    let convertedTemp;
    let convertedHighTemp;
    let convertedLowTemp;

    if (currentUnit === "F") {
        convertedTemp = (((storedWeatherData.temperature - 32) * 5/9).toFixed(1));
        convertedHighTemp = (((storedWeatherData.highTemp - 32) * 5/9).toFixed(1));
        convertedLowTemp = (((storedWeatherData.lowTemp - 32) * 5/9).toFixed(1));
        currentUnit = "C"
    }
    else {  
        convertedTemp = storedWeatherData.temperature; 
        convertedHighTemp = storedWeatherData.highTemp;  
        convertedLowTemp = storedWeatherData.lowTemp;   
        currentUnit = "F";    
    }

    tempElement.textContent = `Temperature: ${convertedTemp}°${currentUnit}`;
    highTempElement.textContent = `HighTemp: ${convertedHighTemp}°${currentUnit}`;
    lowTempElement.textContent = `LowTemp: ${convertedLowTemp}°${currentUnit}`;
});

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
        highTemp: highTemp,
        lowTemp: lowTemp
    };
}

async function getWeatherData(location) {
    const API_KEY = "9J6PHJVGT78L9JLU2DYJ8HJST";

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const weatherData = processWeatherData(data);
        storedWeatherData = weatherData;

        if (!response.ok) {
            alert("something went wrong!")
        }
        else {
            content.innerHTML="";
            const temp = document.createElement("p");
            const conditions = document.createElement("p");
            const location = document.createElement("p");
            const humidity = document.createElement("p");
            const icon = document.createElement("p");
            const highTemp = document.createElement("p");
            const lowTemp = document.createElement("p");

            tempElement = temp; 
            highTempElement = highTemp;
            lowTempElement = lowTemp;

            temp.textContent = `Temperature: ${weatherData.temperature}°F`;
            conditions.textContent = `Conditions: ${weatherData.conditions}`;
            location.textContent = `Location: ${weatherData.location}`;
            humidity.textContent = `Humidity: ${weatherData.humidity}%`;
            icon.textContent = weatherData.icon;
            highTemp.textContent = `HighTemp: ${weatherData.highTemp}°F`;
            lowTemp.textContent = `LowTemp: ${weatherData.lowTemp}°F`;

            content.append( temp, conditions, location, humidity, icon, highTemp, lowTemp);
        }
    }
    catch(error) {
        console.error("Error fetching weather:", error);
    }
}