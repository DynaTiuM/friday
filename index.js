const brain = require('brain.js');
const fs = require('fs');
require('dotenv').config();
const getWeather = require('./weather');

const discordToken = process.env.DISCORD_TOKEN;

const net = new brain.recurrent.LSTM({
  hiddenLayers: [30, 30],
  activation: 'sigmoid',
});

const options = {
  iterations: 1100,
  log: (error) => console.log(error),
};
const trainingData = JSON.parse(fs.readFileSync('trainingData.json', 'utf-8'));

net.train(trainingData, options);
saveLearnedData();
//loadLearnedData();


function useNeuralNetwork(entry) {
  const exit = net.run(entry);
  console.log(exit);
  return exit;
}

function saveLearnedData() {
  const learnedData = JSON.stringify(net.toJSON());

  fs.writeFileSync('modele_IA.json', learnedData, 'utf-8', (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde des données apprises :', err);
    } else {
      console.log('Données apprises sauvegardées avec succès.');
    }
  });
}

function loadLearnedData() {
  try {
    const learnedData = fs.readFileSync('modele_IA.json', 'utf-8');

    const jsonModel = JSON.parse(learnedData);

    net.fromJSON(jsonModel);

    console.log('Données apprises chargées avec succès.');
  } catch (err) {
    console.error('Erreur lors du chargement des données apprises :', err);
  }
}


const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log("bot opérationnel");
});

client.on("messageCreate", async message => {

  if (message.content.startsWith('!')) {
    const entry = message.content.substring(1);
    const response = useNeuralNetwork(entry);

    if (response == null || response == '') {
      message.channel.send("Désolé, je n'ai pas compris ton message.");
    }
    else {
      switch (response) {
        case "meteo":
        if(message.content.includes("aujourd'hui")) {
            console.log("ajd");
            message.channel.send(await getWeather(message.content, "aujourd'hui"));
        }
        else {
          console.log("demain");
          message.channel.send(await getWeather(message.content, "demain"));
        }
        
        break;
        default : message.channel.send(response);
        break;
      }
    }
  }
});

client.login(discordToken);
