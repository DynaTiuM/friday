const { Client, GatewayIntentBits } = require("discord.js");
require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.on("ready", () =>{
    console.log("bot opérationnel");
});

client.login(discordToken);