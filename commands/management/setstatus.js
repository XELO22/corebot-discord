const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const lang = Utils.variables.lang;

module.exports = {
    name: 'setstatus',
    run: async (bot, message, args) => {
        message.channel.send(Embed({
            title: lang.ManagementModule.Commands.Setstatus.Embeds.Setup.Title,
            description: lang.ManagementModule.Commands.Setstatus.Embeds.Setup.Description
        })).then(async msg => {
            let emojis = ['🟢', '🔴', '🟠', '⚫']
            emojis.forEach(emoji => {
                msg.react(emoji).catch(err => { })
            });

            Utils.waitForReaction(emojis, message.author.id, msg).then(async reaction => {
                msg.delete();
                let type;

                if (reaction.emoji.name == '🟢') {
                    type = 'online'
                } else if (reaction.emoji.name == '🔴') {
                    type = 'dnd'
                } else if (reaction.emoji.name == '🟠') {
                    type = 'idle'
                } else if (reaction.emoji.name == '⚫') {
                    type = 'invisible'
                }
                
                if (bot.user.presence.status == type) return message.channel.send(Embed({
                    preset: "error",
                    description: lang.ManagementModule.Commands.Setstatus.AlreadySet
                }))

                await bot.user.setStatus(type)
                message.channel.send(Embed({ 
                    title: lang.ManagementModule.Commands.Setstatus.Embeds.Updated.Title,
                    description: lang.ManagementModule.Commands.Setstatus.Embeds.Updated.Description.replace(/{status}/g, type == 'dnd' ? lang.ManagementModule.Commands.Setstatus.Embeds.Updated.DND : type.charAt(0).toUpperCase() + type.substring(1))
                }))
            })
        });
    },
    description: "Set the bot's status",
    usage: 'setstatus',
    aliases: []
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706