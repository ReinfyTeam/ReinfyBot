const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
 
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
client.commands = new Collection();
const config = require("./config.json");
// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;
const express = require('express'); // enable express on nodejs
const app = express(); // make web/app express

app.use(express.static('public')); // set website to public

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html'); // make response file to enable uptimerobot.com to status code "200"
});
const listener = app.listen(process.env.PORT, () => {
  console.log("Server Started.")
});

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}
// Set the bot's presence (activity and status)
client.on("ready", () => {
    client.user.setPresence({
        activities: [{ 
          name: "my discord server!",
          type: "WATCHING"
        }],
        status: "dnd"
    })
})
const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commands) {
  const commandName = file.split(".")[0];
  const command = require(`./commands/${file}`);

  console.log(`Attempting to load command ${commandName}!`);
  client.commands.set(commandName, command);
}

client.login(process.env.token);
