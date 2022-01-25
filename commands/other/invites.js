const Utils = require("../../modules/utils.js");
const Embed = Utils.Embed;
const Discord = Utils.Discord;
const config = Utils.variables.config;
const lang = Utils.variables.lang;

module.exports = {
    name: 'invites',
    run: async (bot, message, args) => {
        let guildInvites = await message.guild.fetchInvites();
        let user = message.mentions.users.first() || message.author;
        let invites = guildInvites.filter(i => {
            if (i.inviter) {
                return i.inviter.id == user.id;
            }
        });
        let count = 0;
        invites.forEach(invite => {
            count += invite.uses;
        })
        await message.channel.send(Embed({ title: lang.Other.OtherCommands.Invites.Title, description: lang.Other.OtherCommands.Invites.Description.replace(/{user}/g, message.mentions.users.first() || message.author).replace(/{amt}/g, count).replace(/{form}/g, (count !== 1) ? lang.Other.OtherCommands.Invites.People : lang.Other.OtherCommands.Invites.Person) }));
    },
    description: "View your invites",
    usage: 'invites',
    aliases: []
}
// 239232   8501   2229706    63250   P__%%   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706