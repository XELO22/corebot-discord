const Utils = require('../utils');
const lang = Utils.variables.lang;
const Embed = Utils.Embed;

module.exports = async function (bot) {
    const Giveaways = await Utils.variables.db.get.getGiveaways();
    Giveaways.forEach(async giveaway => {
        const guild = bot.guilds.cache.get(giveaway.guild);
        const channel = !!guild ? guild.channels.cache.get(giveaway.channel) : undefined;
        if (!guild || !channel) return;
        if (giveaway.end <= Date.now() && !giveaway.ended) {
            await Utils.variables.db.update.giveaways.setToEnded(giveaway.messageID);

            channel.messages.fetch(giveaway.messageID).then(async msg => {
                if (!msg || msg.deleted) return await Utils.variables.db.update.deleteGiveaway(giveaway.messageID);
                const winners = [];
                const reactions = await Utils.variables.db.get.getGiveawayReactions(giveaway.messageID);
                if (reactions.length == 0) return channel.send(Utils.Embed({ preset: 'error', description: lang.GiveawaySystem.Errors.NoOneEntered }));
                for (let i = 0; i < giveaway.winners; i++) {
                    let user = reactions[~~(Math.random() * reactions.length)];
                    winners.push(user);
                    reactions.splice(reactions.indexOf(user), 1);
                    await Utils.variables.db.update.giveaways.reactions.removeReaction(giveaway.messageID, user)
                }

                await Utils.variables.db.update.giveaways.setWinners(JSON.stringify(winners), giveaway.messageID)
                msg.edit(lang.GiveawaySystem.GiveawayEndedEmbed.Content, Utils.Embed({
                    title: lang.GiveawaySystem.GiveawayEndedEmbed.Title.replace(/{giveawaytitle}/g, msg.embeds[0].title),
                    description: lang.GiveawaySystem.GiveawayEndedEmbed.Description.replace(/{winners}/g, winners.filter(u => u).map(u => "<@" + u + "> ").join("\n")),
                    footer: lang.GiveawaySystem.GiveawayEndedEmbed.Footer,
                    timestamp: msg.embeds[0].timestamp
                }))
                channel.send(Utils.Embed({
                    title: lang.GiveawaySystem.GiveawayWinnerEmbed.Title,
                    description: lang.GiveawaySystem.GiveawayWinnerEmbed.Description.replace(/{winners}/g, winners.filter(u => u).map(u => "<@" + u + "> ").join(", ")).replace(/{prize}/g, giveaway.name),
                }));
                channel.send(winners.filter(u => u).map(u => "<@" + u + ">").join(",")).then(m => m.delete({ timeout: 2500 }));
            }).catch(async err => {
                return await Utils.variables.db.update.giveaways.deleteGiveaway(giveaway.messageID);
            })

        } else if (!giveaway.ended) {
            channel.messages.fetch(giveaway.messageID).then(async msg => {

                await msg.edit(Utils.Embed({
                    title: msg.embeds[0].title,
                    description: lang.GiveawaySystem.Commands.Gcreate.Embeds.Giveaway.Description
                        .replace(/{giveawaydesc}/g, giveaway.description || giveaway.desc)
                        .replace(/{emoji}/g, Utils.variables.config.Other.Giveaways.DiscordEmoji)
                        .replace(/{host}/g, '<@' + giveaway.creator + '>')
                        .replace(/{winners}/g, giveaway.winners)
                        .replace(/{timer}/g, Utils.getTimeDifference(new Date(), new Date(giveaway.end))),
                    footer: msg.embeds[0].footer.text,
                    timestamp: msg.embeds[0].timestamp
                }))
            })

        }
    })
    return module.exports;
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706