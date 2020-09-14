/* eslint-disable no-unused-vars */
const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
    aliases: ["dumpinfo"],
    description: "Dumps server info into your channel",
    required_permissions: ['ADMINISTRATOR'],
    async execute(message, args) {
        message.delete();

        const preEmbed = await new Discord.MessageEmbed()
            .setColor("#2f3136")
            .setImage(
                "https://media.discordapp.net/attachments/624636870512345088/635601760672546858/banner1hollow.png"
            );
        const infoEmbed = await new Discord.MessageEmbed()
            .setColor("#2f3136")
            .setTitle(":wave:  ‎**Welcome!**")
            .setDescription(config.description);
        const rulesEmbed = await new Discord.MessageEmbed()
            .setColor("#2f3136")
            .setTitle("🚔 ‎ **Rules**")
            .setDescription(
                "Basis - be respectful and be responsible\n‏‏‏‏‎\n ‎ • No spam, keep the chat clean.\n‏‏‏‏‎ ‎• Keep personal topics to a minimum. Talking about religion, your personal mental state or even politics could make someone feel uncomfortable\n‏‏‏‏‎ ‎• No impersonating Moderators"
            );
        const socialsEmbed = await new Discord.MessageEmbed()
            .setColor("#2f3136")
            .setTitle(":earth_americas:  ‎**Social Media**")
            .setDescription(
                ":jigsaw: [GitHub](https://github.com/" +
                config.github +
                ")\n" +
                ":link: [Site](" +
                config.site +
                ")\n" +
                ":bird: [Twitter](https://twitter.com/" +
                config.twitter +
                ")"
            );
        const backportEmbed = await new Discord.MessageEmbed()
            .setColor("#2f3136")
            .setTitle(":exclamation:  ‎**Mod Backporting**")
            .setDescription(
                "Please don't ask us to backport our mods to a previous version, it will most likely be a no. Backporting takes a lot of time and effort, so taking that time to *downdate* a mod is not worth it."
            );

        const embeds = [preEmbed, infoEmbed, rulesEmbed, socialsEmbed, backportEmbed];

        embeds.forEach(async (item) => {
            await message.channel.send(item);
        });

        message.channel.send("https://discord.gg/Yqkb9N3");
    },
};
