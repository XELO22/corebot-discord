const Utils = require('../../modules/utils');
const lang = Utils.variables.lang;
const Embed = Utils.Embed;

module.exports = {
    name: "givecoins",
    run: async (bot, message, args) => {
        let everyone = ["all", "everyone", "@everyone"].some(text => args.includes(text)) ? true : false;
        let user = Utils.ResolveUser(message, 0) || Utils.ResolveUser(message, 1);
        let amount = /<@![0-9]{18}>/.test(args[0]) || ["all", "everyone", "@everyone"].includes(args[0]) ? parseInt(args[1]) : parseInt(args[0]);

        if (args.length < 1 || !amount || (!everyone && !user)) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));
        if (!everyone && user.user.bot) return message.channel.send(Embed({ preset: "error", description: lang.AdminModule.Commands.Givecoins.GiveToBot }));

        if (everyone) {
            await message.guild.members.cache.array().filter(m => !m.user.bot).forEach(async member => {
                await Utils.variables.db.update.coins.updateCoins(member, amount, 'add');
            })
        } else {
            await Utils.variables.db.update.coins.updateCoins(user, amount, 'add')
        }

        message.channel.send(Embed({
            title: lang.AdminModule.Commands.Givecoins.CoinsAdded.Title,
            description: lang.AdminModule.Commands.Givecoins.CoinsAdded.Description.replace(/{amount}/g, amount.toLocaleString()).replace(/{user}/g, user || lang.AdminModule.Commands.Givecoins.CoinsAdded.Everyone),
            timestamp: new Date()
        }))
    },
    description: "Give coins to all or a certain user",
    usage: "givecoins <amount> <@user/all/everyone>",
    aliases: ['addcoins']
}
// 239232   8501   NCE__%%    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706