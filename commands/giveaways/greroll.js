const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const lang = Utils.variables.lang;

module.exports = {
    name: 'greroll',
    run: async (bot, message, args) => {
        const giveaway = args.length > 0 ? await Utils.variables.db.get.getGiveawayFromID(args[0]) || await Utils.variables.db.get.getGiveawayFromName(args[0]) : await Utils.variables.db.get.getLatestGiveaway();
        if (args.length > 0 && !giveaway) {
            return message.channel.send(Embed({ preset: 'error', description: lang.GiveawaySystem.Commands.Greroll.Errors.InvalidGiveaway.replace(/{name}/g, args[0]) }));
        } else if (!giveaway) {
            return message.channel.send(Embed({ preset: 'error', description: lang.GiveawaySystem.Commands.Greroll.Errors.NoGiveaways }));
        } else {
            bot.guilds.cache.first().channels.cache.get(giveaway.channel).messages.fetch(giveaway.messageID).then(async msg => {
                if (!giveaway.ended) return message.channel.send(Embed({ preset: 'error', description: lang.GiveawaySystem.Commands.Greroll.Errors.GiveawayHasntEnded }));

                let winners = await Utils.variables.db.get.getGiveawayWinners(giveaway.messageID);
                let newWinners = [];
                const users = Utils.ResolveUser(message, 1) || winners;
                const reactions = await Utils.variables.db.get.getGiveawayReactions(giveaway.messageID);
                const channel = Utils.findChannel(giveaway.channel, message.guild);

                if (!channel) return message.channel.send(Embed({ preset: 'console' }));
                if (reactions.length == 0) return message.channel.send(Embed({ preset: 'error', description: lang.GiveawaySystem.Errors.NoOneEntered }));


                if (users.length !== undefined && users.length > 1) {
                    await Utils.asyncForEach(users, async userID => {
                        let updatedReactions = await Utils.variables.db.get.getGiveawayReactions(giveaway.messageID);
                        let newWinner = updatedReactions[~~(Math.random() * updatedReactions.length)]
                        newWinners.push(newWinner)
                        if (newWinner) await Utils.variables.db.update.giveaways.reactions.removeReaction(giveaway.messageID, newWinner)
                    })

                    await end()
                    channel.send(users.map(u => "<@" + u + ">")).then(m => m.delete({ timeout: 2500 }));
                } else {
                    winners.splice(winners.indexOf(users.id), 1)
                    newWinners = winners
                    let newWinner = reactions[~~(Math.random() * reactions.length)];
                    newWinners.push(newWinner);
                    if (newWinner) await Utils.variables.db.update.giveaways.reactions.removeReaction(giveaway.messageID, newWinner)

                    await end()
                    channel.send("<@" + (users.id || users) + ">").then(m => m.delete({ timeout: 2500 }));
                }

                async function end() {
                    newWinners = newWinners.filter(winner => !!winner);
                    channel.send(Utils.Embed({
                        title: lang.GiveawaySystem.GiveawayWinnersReRolled.Title,
                        description: lang.GiveawaySystem.GiveawayWinnersReRolled.Description.replace(/{winners}/g, newWinners.map(u => "<@" + u + ">").join(", ")).replace(/{prize}/g, giveaway.name),
                        footer: lang.GiveawaySystem.GiveawayWinnersReRolled.Footer
                    }));
                    msg.edit(lang.GiveawaySystem.GiveawayEndedEmbed.Content, Utils.Embed({
                        title: lang.GiveawaySystem.GiveawayEndedEmbed.Title.replace(/{giveawaytitle}/g, msg.embeds[0].title),
                        description: lang.GiveawaySystem.GiveawayEndedEmbed.Description.replace(/{winners}/g, newWinners.map(u => "<@" + u + ">").join("\n")),
                        footer: lang.GiveawaySystem.GiveawayEndedEmbed.Footer,
                        timestamp: msg.embeds[0].timestamp
                    }))
                    message.channel.send(Utils.Embed({ title: lang.GiveawaySystem.Commands.Greroll.Rerolled }));
                    await Utils.variables.db.update.giveaways.setWinners(JSON.stringify(newWinners), giveaway.messageID)
                }
            })
        }
    },
    description: "Create a new set of winners for the giveaway",
    usage: 'greroll [giveaway name] [@user]',
    aliases: []
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706