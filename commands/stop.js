const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("../config.json");
const secrets = require("../secrets.json");

client.login(secrets.token);

module.exports = {
    aliases: ["stop", "restart"],
    description: "Cleanly stops the bot",
    required_permissions: ["ADMINISTRATOR"],
    execute(message, args) {
        message.channel
            .send(
                "<@" + message.author.id + "> stopped the bot. Auto-restarting!"
            )
            .then(() => {
                client.user.setActivity("🔴").then(() => {
                    process.exit(1);
                });
            });
    },
};
