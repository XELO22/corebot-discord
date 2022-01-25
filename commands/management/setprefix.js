const Utils = require("../../modules/utils.js");
const lang = Utils.variables.lang;
const config = Utils.variables.config;
const Embed = Utils.Embed;

module.exports = {
    name: 'setprefix',
    run: async (bot, message, args) => {
        if (args.length == 0) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));

        await Utils.variables.db.update.prefixes.updatePrefix(message.guild.id, args[0]);
        
        message.channel.send(Embed({
            title: lang.ManagementModule.Commands.Setprefix.Title,
            description: lang.ManagementModule.Commands.Setprefix.Description.replace(/{prefix}/g, args[0]),
            color: config.EmbedColors.Success
        }));
    },
    description: "Set the bot's prefix",
    usage: 'setprefix <prefix>',
    aliases: []
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706