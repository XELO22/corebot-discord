const Utils = require("../../modules/utils.js");
const Embed = Utils.Embed;
const lang = Utils.variables.lang;

module.exports = {
    name: 'profile',
    run: async (bot, message, args) => {
        const user = Utils.ResolveUser(message) || message.member;

        const { xp, level } = await Utils.variables.db.get.getExperience(user);
        const coins = await Utils.variables.db.get.getCoins(user);

        let xpBar = "[";

        const levelXp = ~~(level * (175 * level) * 0.5);
        const percent = (xp / levelXp) * 100;

        const filledBars = ~~(percent / 5);

        if (filledBars > 0) {
            xpBar += "**";

            let i = 0;
            while (i < filledBars) {
                xpBar += "=";
                i++;
            }

            xpBar += "**" + "=".repeat((20 - filledBars) || 0) + "]";
        } else {
            xpBar += "=".repeat(20) + "]";
        }

        message.channel.send(Embed({
            author: {
                icon: user.user.displayAvatarURL({ dynamic: true }),
                text: user.user.username
            },
            title: lang.Other.OtherCommands.Profile.Title,
            description: lang.Other.OtherCommands.Profile.Description
                .replace(/{bars}/g, xpBar)
                .replace(/{percent}/g, ~~percent)
                .replace(/{next_level}/g, level + 1),
            fields: [
                {
                    name: lang.Other.OtherCommands.Profile.Fields[0],
                    value: coins,
                    inline: true
                },
                {
                    name: lang.Other.OtherCommands.Profile.Fields[1],
                    value: level,
                    inline: true
                },
                {
                    name: lang.Other.OtherCommands.Profile.Fields[2],
                    value: xp,
                    inline: true
                },
            ],
            timestamp: new Date()
        }))
    },
    description: "View a user's profile",
    usage: 'profile [@user]',
    aliases: [
        'stats'
    ]
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706