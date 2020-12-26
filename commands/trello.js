/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
    aliases: ['trello','trel'],
    description: 'Replies with the Team Hollow Trello',
    execute(message, args) {
        const logo = "https://teamhollow.net/assets/logo.png";
        const embed = new Discord.MessageEmbed()
          .setAuthor('Team Hollow Trello', logo)
          .setColor("#FFB6C1")
          .setDescription('https://trello.com/b/' + config.trello)
          .setThumbnail(logo)
          .setTimestamp();

          message.channel.send(embed);
    },
};
