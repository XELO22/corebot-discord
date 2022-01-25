const Utils = require("../../modules/utils.js")
const { config, lang, embeds } = Utils.variables;

module.exports = {
    name: 'leveltop',
    run: async (bot, message, args) => {
        let page = +args[0] || 1;

        const allXP = (await Utils.variables.db.get.getExperience())
            .filter(x => x.guild == message.guild.id &&
                x.user &&
                x.user.toLowerCase() !== 'unknown' &&
                x.xp >= 0 &&
                x.level >= 1 &&
                (config.Leaderboards.FilterUnknown ? !!message.guild.member(x.user) : true)
            );

        if (page > Math.ceil(allXP.length / config.Leaderboards.UsersPerPage.Levels)) page = 1;

        let xp = allXP
            .sort((a, b) => b.xp - a.xp)
            .map(x => JSON.stringify(x));

        xp = [...new Set(xp)]
            .map(x => JSON.parse(x))
            .slice((page - 1) * config.Leaderboards.UsersPerPage.Levels, config.Leaderboards.UsersPerPage.Levels * page)
            .map((xp, i) =>
                `**${++i + (page - 1) * config.Leaderboards.UsersPerPage.Levels}.** Level: \`\`${xp.level.toLocaleString()}\`\` XP: \`\`${xp.xp.toLocaleString()}\`\` - ${message.guild.member(xp.user) || lang.XPModule.LeveltopUnknownUser}`
            );

        if (xp.length < 1) return message.channel.send(Utils.setupEmbed({
            configPath: embeds.Embeds.LevelTop,
            description: lang.XPModule.LeveltopLeaderboardEmpty,
            variables: [
                { searchFor: /{current-page}/g, replaceWith: page },
                { searchFor: /{max-pages}/g, replaceWith: Math.ceil(allXP.length / config.Leaderboards.UsersPerPage.Levels) },
                { searchFor: /{totalxp}/g, replaceWith: "0" },
                { searchFor: /{bot-pfp}/g, replaceWith: bot.user.displayAvatarURL({ dynamic: true }) }
            ]
        }));

        const total = allXP.map(x => x.xp || 0).reduce((acc, cv) => acc + cv);

        message.channel.send(Utils.setupEmbed({
            configPath: embeds.Embeds.LevelTop,
            description: xp.join('\n'),
            variables: [
                { searchFor: /{current-page}/g, replaceWith: page },
                { searchFor: /{max-pages}/g, replaceWith: Math.ceil(allXP.length / config.Leaderboards.UsersPerPage.Levels) },
                { searchFor: /{bot-pfp}/g, replaceWith: bot.user.displayAvatarURL({ dynamic: true }) },
                { searchFor: /{totalxp}/g, replaceWith: total }
            ]
        }));
    },
    description: "Check the experience leaderboard",
    usage: 'leveltop [page]',
    aliases: [
        'levellb'
    ]
}

// 239232   8501   2229706    SION__%%   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706