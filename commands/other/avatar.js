const Utils = require("../../modules/utils.js");
const Discord = Utils.Discord;
const Embed = Utils.Embed;
const config = Utils.variables.config;
const lang = Utils.variables.lang;

module.exports = {
    name: 'avatar',
    run: async (bot, message, args) => {
        let user = Utils.ResolveUser(message) || message.member;
        let avatar = user.user.displayAvatarURL({ dynamic: true });
        if (!avatar.endsWith('?size=2048')) avatar += "?size=2048";
        message.channel.send(Embed({
            title: lang.Other.OtherCommands.Avatar.Title.replace(/{user}/g, user.user.username),
            image: avatar,
            author: {
                text: user.user.username,
                icon: user.user.displayAvatarURL({ dynamic: true })
            }
        }))
    },
    description: "View a user's avatar",
    usage: 'avatar [@user]',
    aliases: [

    ]
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706