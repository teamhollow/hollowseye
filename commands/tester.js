/* eslint-disable no-unused-vars */
module.exports = {
    aliases: ['tester'],
    description: 'Gives yourself the tester role!',
    async execute(message, args) {
        let tester = await message.guild.roles.cache.get("423562790125568011");

        if (message.member.roles.cache.has(tester.id)) {
            message.member.roles.remove(tester.id).catch(console.error);
            message.reply(`removed ${tester.name}!`);
        } else {
            message.member.roles.add(tester.id).catch(console.error);
            message.reply(`added ${tester.name}!`);
        }
    },
};
