const Utils = require("../../modules/utils.js");
const Discord = Utils.Discord;
const Embed = Utils.Embed;
const config = Utils.variables.config;
const lang = Utils.variables.lang;
const fs = require("fs");

module.exports = {
    name: 'add',
    run: async (bot, message, args) => {
        const ticket = await Utils.variables.db.get.getTickets(message.channel.id);
        if (!ticket) return message.channel.send(Embed({ preset: 'error', description: lang.TicketModule.Errors.TicketNotExist }));

        const user = Utils.ResolveUser(message);

        if (args.length == 0 || !user) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));
        if (user.id == message.author.id) return message.channel.send(Embed({ preset: 'error', description: lang.TicketModule.Commands.Add.Errors.AddSelf }));

        const AddedUsers = await Utils.variables.db.get.getAddedUsers(message.channel.id);
        if (message.channel.members.get(user.id) || AddedUsers.map(u => u.user).includes(user.id)) {
            return message.channel.send(Embed({ preset: 'error', description: lang.TicketModule.Commands.Add.Errors.UserAlreadyHaveAccess }));
        }

        await Utils.variables.db.update.tickets.addedUsers.add(message.channel.id, user.id);

        await message.channel.createOverwrite(user.id, {
            VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGES: true, ADD_REACTIONS: true, READ_MESSAGE_HISTORY: true
        })

        message.channel.send(Embed({ 
            title: lang.TicketModule.Commands.Add.Embeds.UserAdded.Title, 
            description: lang.TicketModule.Commands.Add.Embeds.UserAdded.Description.replace(/{user}/g, `<@${user.id}>`) 
        }));
        
        bot.emit("ticketUserAdded", ticket, message.member, user);
    },
    description: "Add a user to a ticket.",
    usage: 'add <@user>',
    aliases: [
        'adduser'
    ]
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706