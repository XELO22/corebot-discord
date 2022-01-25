const Discord = require("discord.js");
const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const config = Utils.variables.config;
const lang = Utils.variables.lang;
const fs = require("fs");

module.exports = {
    name: 'remove',
    run: async (bot, message, args) => {
        const ticket = await Utils.variables.db.get.getTickets(message.channel.id);
        if (!ticket) return message.channel.send(Embed({ preset: 'error', description: lang.TicketModule.Errors.TicketNotExist }));

        const user = Utils.ResolveUser(message);

        if (args.length == 0 || !user) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));
        if (user.id == message.author.id) return message.channel.send(Embed({ preset: 'error', description: lang.TicketModule.Commands.Remove.Errors.RemoveOwnAccess }));

        const AddedUsers = await Utils.variables.db.get.getAddedUsers(message.channel.id);
        if (!AddedUsers.map(u => u.user).includes(user.id) && !message.channel.members.get(user.id)) return message.channel.send(Embed({ preset: 'error', description: lang.TicketModule.Commands.Remove.Errors.NoAccess }));

        await Utils.variables.db.update.tickets.addedUsers.remove(message.channel.id, user.id);

        if (!message.channel.permissionOverwrites.get(user.id)) {
            return message.channel.send(Embed({ preset: 'error', description: lang.TicketModule.Commands.Remove.Errors.CantBeRemoved }))
        }

        await message.channel.createOverwrite(user.id, {
            VIEW_CHANNEL: null, SEND_MESSAGES: null, READ_MESSAGES: null, ADD_REACTIONS: null, READ_MESSAGE_HISTORY: null
        })

        message.channel.send(Embed({ 
            title: lang.TicketModule.Commands.Remove.Embeds.Removed.Title, 
            description: lang.TicketModule.Commands.Remove.Embeds.Removed.Description.replace(/{user}/g, `<@${user.id}>`) 
        }));

        bot.emit("ticketUserRemoved", ticket, message.member, user);
    },
    description: "Remove a user from the ticket you are typing in",
    usage: 'remove <@user>',
    aliases: []
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706