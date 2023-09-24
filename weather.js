
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');

const weatherDescriptions = {
    "clear sky": "ensoleillé",
    "broken clouds": "couvert",
    "scattered clouds": "nuageux",
    "overcast clouds": "nuageux couvrant tout le ciel",
    "heavy intensity rain": "pluie intense"
  };

const apiWeatherKey = process.env.API_WEATHER_KEY;

const cities = JSON.parse(fs.readFileSync('cities.json', 'utf-8'));

async function getWeatherForCity(cityName) {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiWeatherKey}`
        );

        // Traitez les données de réponse ici
        const weatherData = response.data;
        console.log(weatherData);
        return weatherData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données météorologiques :', error);
    }
}

async function findCity(message) {
    for (const city of cities) {
        console.log("searching city : " + city);
        if (message.includes(city)) {
            console.log("City found : " + city);
            return await sendMessage( await getWeatherForCity(city), city);
        }
    }

    console.log("City not found.");
}

function sendMessage(data, cityName) {
    type = getWeatherType(data);
    return `La météo actuelle à ${cityName} est **${type}**. La température actuelle est de **${data.main.temp}°C**. Les températures maximales seront de **${data.main.temp_max}°C** et les minimales de **${data.main.temp_min}°C**.`
}

function getWeatherType(data) {
    const description = data.weather[0].description;

    if (weatherDescriptions.hasOwnProperty(description)) {
        return weatherDescriptions[description];
    }

    return description;
}

module.exports = findCity;