const Utils = require("../../modules/utils.js");
const { config, lang } = Utils.variables;
const Embed = Utils.Embed;

module.exports = {
    name: 'warnings',
    run: async (bot, message, args) => {
        let user = Utils.ResolveUser(message);
        if (!user) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));

        const warnings = await Utils.variables.db.get.getWarnings(user);

        if (!warnings || warnings.length == 0) return message.channel.send(Embed({ preset: 'error', description: lang.ModerationModule.Commands.Warnings.Errors.NoHistory.replace(/{user}/g, user.user.tag) }))

        message.channel.send(Embed({
            author: {
                icon: message.member.user.displayAvatarURL({ dynamic: true }),
                text: message.member.user.username
            },
            title: lang.ModerationModule.Commands.Warnings.Embed.Title,
            footer: { text: user.user ? user.user.tag : user.tag, icon: user.user.displayAvatarURL({ dynamic: true }) },
            fields: warnings.map(warning => {
                let warnedBy = message.guild.member(warning.executor);
                return {
                    name: lang.ModerationModule.Commands.Warnings.Embed.Format[0].replace(/{id}/g, warning.id),
                    value: lang.ModerationModule.Commands.Warnings.Embed.Format[1].replace(/{user}/g, warnedBy || "Unknown").replace(/{reason}/g, warning.reason).replace(/{date}/g, new Date(warning.time).toLocaleString())
                }
            }),
            timestamp: new Date()
        }));
    },
    description: "View the warnings of a user on the Discord server",
    usage: 'warnings [@user]',
    aliases: []
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706