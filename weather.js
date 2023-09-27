
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

async function getWeatherForCity(cityName, day) {
    if(day == "aujourd'hui") {
         try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiWeatherKey}`
            );

            // Traitez les données de réponse ici
            const weatherData = response.data;
            return weatherData;
        } catch (error) {
            console.error('Erreur lors de la récupération des données météorologiques :', error);
        }
    }
    else {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=${apiWeatherKey}`
            );

            // Traitez les données de réponse ici
            const weatherData = response.data;
            return weatherData;
        } catch (error) {
            console.error('Erreur lors de la récupération des données météorologiques :', error);
        }
    }
   
}

async function findCity(message, day) {
    for (var city of cities) {
        message = message.toLowerCase();
        city = city.toLowerCase();
        console.log("searching city : " + city);
        if (message.includes(city)) {
            console.log("City found : " + city);
            return await sendMessage( await getWeatherForCity(city, day), city, day);
        }
    }
    
    return "Désolé, je n'ai pas compris. De quelle ville parlez-vous ?"
}

function sendMessage(data, cityName, day) {
    type = getWeatherType(data, day);
    if(day === "aujourd'hui") return `La météo actuelle à ${cityName} est **${type}**. La température actuelle est de **${data.main.temp}°C**. Les températures maximales seront de **${data.main.temp_max}°C** et les minimales de **${data.main.temp_min}°C**.`
    else if(day === "demain") return `La météo demain à ${cityName} sera **${type}**. La température sera de **${data.list[0].main.temp}°C**. Les températures maximales seront de **${data.list[0].main.temp_max}°C** et les minimales de **${data.list[0].main.temp_min}°C**.`

}

function getWeatherType(data, day) {
    var description;
    if(day === "aujourd'hui") description = data.weather[0].description;
    else if(day === "demain") description = data.list[0].weather[0].description;
 
    if (weatherDescriptions.hasOwnProperty(description)) {
        return weatherDescriptions[description];
    }

    return description;
}

module.exports = findCity;