/* eslint-disable no-unused-vars */
const fs = require("fs");
const Discord = require("discord.js");

const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
client.commands = new Discord.Collection();

const config = require("./config.json");
const secrets = require("./secrets.json");
const package = require("./package.json");

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    command.aliases.forEach((element) => {
        client.commands.set(element, command);
    });
}

console.log("Loading...");
client.login(secrets.token);

// event :: on load
client.on("ready", () => {
    console.log(
        "[" +
        client.user.username +
        " " +
        package.version +
        "] Ready and raring!\n"
    );

    client.user.setActivity(config.activity);
});

// event :: on message
client.on("message", async (message) => {
    if (message.author.bot) return;

    // get args
    const args = message.content.slice(config.prefix.length).split(/ +/);
    // get command
    const command = args.shift().toLowerCase();

    // post message to log if not command
    const isCommand = client.commands.has(command);
    if (!isCommand && config.postMessagesToLog) {
        console.log(
            "[#" +
            message.channel.name +
            "] " +
            message.author.tag +
            ": " +
            message.content
        );
        if (message.attachments.size > 0) console.log("^ has attachments");
    }

    // if not command, return
    if (!message.content.startsWith(config.prefix)) return;

    if (!isCommand) return;

    if (client.commands.get(command).required_permissions != null) {
        var vreturn = false;

        client.commands
            .get(command)
            .required_permissions.forEach((permission) => {
                if (!message.member.hasPermission(permission)) {
                    if (!vreturn)
                        message.channel.send(
                            "<@" +
                            message.author.id +
                            ">, you do not have the required permissions! `" +
                            client.commands.get(command)
                                .required_permissions +
                            "`"
                        );
                    vreturn = true;
                }
            });

        if (vreturn) return;
    }

    try {
        console.log(
            "---> " +
            message.author.tag +
            " ran command `" +
            message.content +
            "` in #" +
            message.channel.name
        );
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(
            "there was an error trying to execute that command!" +
            "\n`" +
            error.message +
            "`"
        );
    }
});

// event :: add reaction
client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log(
                "Something went wrong when fetching the message: ",
                error.message
            );
            return;
        }
    }

    const message = reaction.message;
    if (message.member == null) return;
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;

    if (message.channel.name == "mod-concepts") {
        if (!(reaction.emoji.name == "👍" || reaction.emoji.name == "👎")) {
            reaction = message.reactions.cache.get(reaction.emoji.name);
            if (reaction != null && reaction != undefined)
                reaction.remove()
                        .catch((error) =>
                            console.error("Failed to remove reactions: ", error)
                        );
        }

        const previousEmbed = message.embeds[0];
        var previousHasSpoiler = false;
        if (previousEmbed != undefined) previousHasSpoiler = previousEmbed.description.startsWith("||") && previousEmbed.description.endsWith("||");

        // global remove spoiler
        if (reaction && reaction.emoji.name == "▫️" && previousHasSpoiler) {
            message.edit(
                message.content,
                previousEmbed.setDescription(
                    previousEmbed.description.slice(2, -2)
                )
            );
            return;
        }

        // find other marktypes
        const markTypes = require("./suggestions_marktypes.json");
        var found = false;
        for (markType of markTypes) {
            for (acceptedEmoji of markType[0]) {
                if (reaction && reaction.emoji.name == acceptedEmoji) {
                    found = true;
                    break;
                }
            }

            if (found == true) {
                var newEmbed = previousEmbed.setColor(markType[2]);

                const censoredSuffix = " (Censored)";
                if (markType[3] == true) {
                    if (!previousHasSpoiler)
                        newEmbed.setDescription(
                            "||" + previousEmbed.description + "||"
                        );
                    if (
                        !previousEmbed.author.name
                            .endsWith(censoredSuffix)
                    )
                        newEmbed.setAuthor(
                            previousEmbed.author.name + censoredSuffix,
                            previousEmbed.author.iconURL
                        );
                } else if (
                    previousHasSpoiler &&
                    previousEmbed.author.name
                        .endsWith(censoredSuffix)
                ) {
                    newEmbed
                        .setDescription(previousEmbed.description.slice(2, -2))
                        .setAuthor(
                            previousEmbed.author.name.slice(
                                0,
                                -censoredSuffix.length
                            ),
                            previousEmbed.author.iconURL
                        );
                } else if (
                    previousEmbed.author.name
                        .endsWith(censoredSuffix)
                ) {
                    newEmbed.setAuthor(
                        previousEmbed.author.name.slice(
                            0,
                            -censoredSuffix.length
                        ),
                        previousEmbed.author.iconURL
                    );
                }

                message.edit("Marked as: `" + markType[1] + "` by <@" + user.id + ">", newEmbed);
                break;
            }
        }
    }
});

// event :: on member join
// client.on("guildMemberAdd", (member) => {
//     member.roles.add(
//         member.guild.roles.cache.find((role) => role.id === config.join_role)
//     );
// });

module.exports = {
    client: client
};
