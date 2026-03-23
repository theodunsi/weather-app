import "./style.css";
// import humidityIcon from "./assets/icons/humidity.svg";
// import pressureIcon from "./assets/icons/pressure.svg";
// import uvIndexIcon from "./assets/icons/uvIndex.svg";
// import windIcon from "./assets/icons/wind.svg";


const form = document.getElementById("weather-form");
const submit = document.getElementById("submit");
const input = document.getElementById("search");
const content = document.getElementById("main-content");
const toggle = document.getElementById("toggle");
const header = document.getElementById("header");
const highLow = document.getElementById("high-low");
const loadingState = document.getElementById("loading-state");
const extraInfo = document.getElementById("extra-info");

let currentUnit = "F";
let tempElement = null;
let highTempElement = null;
let lowTempElement = null;
let storedWeatherData = null;

//Emoji mapping to weather icon
const iconMap = {
    "clear-day": "☀️",
    "clear-night": "🌙", 
    "partly-cloudy-day": "⛅",
    "partly-cloudy-night": "☁️",
    "cloudy": "☁️",
    "overcast": "☁️",
    "rain": "🌧️",
    "drizzle": "🌦️", 
    "thunderstorm": "⛈️",
    "snow": "❄️",
    "sleet": "🌨️",
    "fog": "🌫️",
    "wind": "💨"
};

// Add icon mapping for info cards
// const infoIconMap = {
//     humidity: humidityIcon,
//     wind: windIcon, 
//     pressure: pressureIcon,
//     uvIndex: uvIndexIcon
// };

form.addEventListener("submit", function(e) {
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
        currentUnit = "C";
    }
    else {  
        convertedTemp = storedWeatherData.temperature; 
        convertedHighTemp = storedWeatherData.highTemp;  
        convertedLowTemp = storedWeatherData.lowTemp;   
        currentUnit = "F";    
    }

    tempElement.textContent = `${convertedTemp}°${currentUnit}`;
    highTempElement.textContent = `H:${convertedHighTemp}°${currentUnit}`;
    lowTempElement.textContent = `L:${convertedLowTemp}°${currentUnit}`;
});

function processWeatherData(data) {
    const currentTemp = data.currentConditions.temp;
    const conditions = data.currentConditions.conditions;
    const location = data.resolvedAddress;
    const humidity = data.currentConditions.humidity;
    const wind = data.currentConditions.windspeed;
    const pressure = data.currentConditions.pressure;
    const uvindex = data.currentConditions.uvindex;
    const icon = data.currentConditions.icon;
    const description = data.description;
    const highTemp = data.days[0].tempmax;
    const lowTemp = data.days[0].tempmin;

    return {
        temperature: currentTemp,
        conditions: conditions,
        location: location,
        humidity: humidity,
        icon: icon,
        highTemp: highTemp,
        lowTemp: lowTemp,
        description: description,
        wind: wind,
        pressure: pressure,
        uvIndex: uvindex,
    };
}

async function getWeatherData(location) {
    const API_KEY = "9J6PHJVGT78L9JLU2DYJ8HJST";

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        const weatherData = processWeatherData(data);
        storedWeatherData = weatherData;

        if (!response.ok) {
            alert("something went wrong!")
        }
        else {
            content.innerHTML="";
            header.innerHTML="";
            highLow.innerHTML="";
            extraInfo.innerHTML="";

            // Hide loading state, show weather content
            loadingState.style.display = "none";
            content.style.display = "flex";  
            toggle.style.display = "block";

            const temp = document.createElement("p");
            const conditions = document.createElement("p");
            const location = document.createElement("p");
            const humidityLabel = document.createElement("p");
            const humidityValue = document.createElement("p");
            const windLabel = document.createElement("p");
            const windValue = document.createElement("p");
            const pressureLabel = document.createElement("p");
            const pressureValue = document.createElement("p");
            const uvIndexLabel = document.createElement("p");
            const uvIndexValue = document.createElement("p");
            const icon = document.createElement("p");
            const highTemp = document.createElement("p");
            const lowTemp = document.createElement("p");
            const description = document.createElement("p");
            const humidityInfo = document.createElement("div");
            const windInfo = document.createElement("div");
            const pressureInfo = document.createElement("div");
            const uvIndexInfo = document.createElement("div");

            tempElement = temp; 
            highTempElement = highTemp;
            lowTempElement = lowTemp;

            temp.textContent = `${weatherData.temperature}°F`;
            conditions.textContent = `${weatherData.conditions}`;
            location.textContent = `${weatherData.location}`.toUpperCase();

            humidityLabel.textContent = `Humidity`;
            humidityValue.textContent = `${weatherData.humidity}%`;

            windLabel.textContent = `Wind`;
            windValue.textContent = `${weatherData.wind}km/h`;

            pressureLabel.textContent = `Pressure`;
            pressureValue.textContent = `${weatherData.pressure}hPa`;

            uvIndexLabel.textContent = `UV Index`;
            uvIndexValue.textContent = `${weatherData.uvIndex}`;

            const emoji = iconMap[weatherData.icon] || "🌤️"
            icon.textContent = emoji;
            highTemp.textContent = `H:${weatherData.highTemp}°F`;
            lowTemp.textContent = `L:${weatherData.lowTemp}°F`;
            description.textContent = `${weatherData.description}`;

            //styling
            temp.classList.add("h1")
            location.classList.add("h2")
            humidityLabel.classList.add("more-info")
            humidityValue.classList.add("more-info")
            windLabel.classList.add("more-info")
            windValue.classList.add("more-info")
            pressureLabel.classList.add("more-info")
            pressureValue.classList.add("more-info")
            uvIndexLabel.classList.add("more-info")
            uvIndexValue.classList.add("more-info")
            conditions.classList.add("h3")
            icon.classList.add("icon")
            humidityInfo.classList.add("info")
            windInfo.classList.add("info")
            pressureInfo.classList.add("info")
            uvIndexInfo.classList.add("info")

            humidityInfo.append(humidityLabel, humidityValue);
            windInfo.append(windLabel, windValue);
            pressureInfo.append(pressureLabel, pressureValue);
            uvIndexInfo.append(uvIndexLabel, uvIndexValue);

            highLow.append(highTemp, lowTemp);
            header.append(icon, location, temp, conditions, highLow, description);
            extraInfo.append(humidityInfo, windInfo, pressureInfo, uvIndexInfo);
            content.append(header, extraInfo);
        }
        
        // add background img based on current weather
        document.body.className = "";
        if (weatherData.icon.includes("snow") || weatherData.icon === "sleet" || weatherData.icon === "blizzard") {
            document.body.classList.add("snow");
        } 
        else if (weatherData.icon.includes("rain") || weatherData.icon === "drizzle" || weatherData.icon === "thunderstorm" || weatherData.icon.includes("storm")) {
            document.body.classList.add("rain");
        }
        else if (weatherData.icon === "clear-night" || weatherData.icon === "partly-cloudy-night") {
            document.body.classList.add("night");
        }
        else {
            // Default: day (covers clear-day, partly-cloudy-day, cloudy, fog, wind, etc.)
            document.body.classList.add("day");
        }
    }
    catch(error) {
        console.error("Error fetching weather:", error);
    }
}

// Get user's location on page load
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const coordinates = `${lat},${lon}`;
            
            // Get the place name first
            const placeName = await getPlaceName(lat, lon);
            
            getWeatherData(placeName);
        },
        function(error) {
            console.log("Location denied, using default");
            getWeatherData("London");
        }
    );
}

//Get coordinates location name
async function getPlaceName(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Return a nice format like "Lagos, Nigeria" instead of the full long address
        const city = data.address.city || data.address.lga || data.address.state || data.address.area;
        const country = data.address.country;
        return `${city}, ${country}`;
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return "Current Location"; 
    }
}