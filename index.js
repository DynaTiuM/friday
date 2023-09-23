const brain = require('brain.js');
const fs = require('fs');

const net = new brain.recurrent.LSTM({
  hiddenLayers: [55, 50],
  activation: 'sigmoid',
});

const options = {
  iterations: 1000,
  log: (error) => console.log(error),
};
const trainingData = JSON.parse(fs.readFileSync('trainingData.json', 'utf-8'));



net.train(trainingData, options);
sauvegarderDonneesApprises();
// chargerDonneesApprises();


function utiliserReseauNeuronal(entrée) {
  const sortie = net.run(entrée);
	console.log(sortie);
  return sortie;
}

function sauvegarderDonneesApprises() {
  const donneesApprises = JSON.stringify(net.toJSON());

  fs.writeFileSync('modele_IA.json', donneesApprises, 'utf-8', (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde des données apprises :', err);
    } else {
      console.log('Données apprises sauvegardées avec succès.');
    }
  });
}

function chargerDonneesApprises() {
  try {
    const donnéesApprises = fs.readFileSync('modele_IA.json', 'utf-8');

    const modèleJSON = JSON.parse(donnéesApprises);

    net.fromJSON(modèleJSON);

    console.log('Données apprises chargées avec succès.');
  } catch (err) {
    console.error('Erreur lors du chargement des données apprises :', err);
  }
}

const { Client, GatewayIntentBits } = require("discord.js");
require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		    GatewayIntentBits.GuildMessages,
		    GatewayIntentBits.MessageContent
    ]
});

client.on("ready", () =>{
    console.log("bot opérationnel");
});

client.on("messageCreate", message => {

  if (message.content.startsWith('!')) {
    const entrée = message.content.substring(1);
    const réponseDuRéseau = utiliserReseauNeuronal(entrée);

    if(réponseDuRéseau == null  || réponseDuRéseau == '') {
      message.channel.send("Désolé, je n'ai pas compris ton message.");
    }
    else message.channel.send(réponseDuRéseau);
  }
});

client.login(discordToken);
