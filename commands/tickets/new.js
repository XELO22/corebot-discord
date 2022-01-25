const Utils = require("../../modules/utils");
const config = Utils.variables.config;
const lang = Utils.variables.lang;
const createTicket = require('../../modules/methods/createTicket');

module.exports = {
    name: 'new',
    run: async (bot, message, args) => {
        createTicket(bot, args, message.member, message.channel);
    },
    description: "Create a ticket",
    usage: config.Tickets.RequireReason ? 'new <reason>' : 'new [reason]',
    aliases: [
        'ticket'
    ]
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706