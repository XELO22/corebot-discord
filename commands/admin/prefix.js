const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const config = Utils.variables.config;
const lang = Utils.variables.lang;

module.exports = {
    name: 'prefix',
    run: async (bot, message, args) => {
        message.channel.send(Embed({
            title: lang.Other.OtherCommands.Prefix.Title,
            description: lang.Other.OtherCommands.Prefix.Description.replace(/{prefixes}/g, [...new Set([`<@!${bot.user.id}>`, await Utils.variables.db.get.getPrefixes(message.guild.id), config.Prefix])].map(p => `> **${p}**\n`).join('\n'))
        }))
    },
    description: "Check the bot's prefix",
    usage: 'prefix',
    aliases: [
        'prefixes'
    ]
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706