/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
    aliases: ["dumpsupport"],
    description: "Dumps #support-us into your channel",
    required_permissions: ['ADMINISTRATOR'],
    async execute(message, args) {
        message.delete();

        const translateEmbed = await new Discord.MessageEmbed()
            .setColor("#3dd0ad")
            .setTitle("Translate Team Hollow!")
            .setDescription(
                "https://translate.teamhollow.net"
            )
            .setThumbnail(
                "https://poeditor.com/public/images/logo/logo.svg"
            );
        const githubEmbed = await new Discord.MessageEmbed()
            .setColor("#222222")
            .setTitle("Contribute to the Team Hollow project(s)!")
            .setDescription(
                "https://github.com/" + config.github
            )
            .setThumbnail(
                "https://github.githubassets.com/images/modules/logos_page/Octocat.png"
            );
        const patreonEmbed = await new Discord.MessageEmbed()
            .setColor("#FF424D")
            .setTitle("Help us via donating!")
            .setDescription(
                "https://donate.teamhollow.net"
            )
            .setThumbnail('https://i0.wp.com/decentered.co.uk/wp-content/uploads/2019/12/patreon-logo-png-badge-7.png');

        const embeds = [translateEmbed, githubEmbed, patreonEmbed];

        embeds.forEach(async (item) => {
            await message.channel.send(item);
        });
    },
};
