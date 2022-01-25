const Discord = require("discord.js");
const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const { config, lang, embeds } = Utils.variables;

module.exports = {
    name: 'links',
    run: async (bot, message, args) => {
        let fields = Object.keys(config.Links).map(name => {
            return { name: name, value: config.Links[name] }
        })

        message.channel.send(Utils.setupEmbed({
            configPath: embeds.Embeds.Links,
            fields: fields
        }))
    },
    description: "View links related to the Discord server",
    usage: 'links',
    aliases: [],
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706