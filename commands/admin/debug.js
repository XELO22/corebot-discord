const Utils = require("../../modules/utils.js");
const { Embed } = Utils;
const { config, lang } = Utils.variables;

module.exports = {
    name: "debug",
    run: async (bot, message, args) => {
        const msg = await message.channel.send(Embed({ title: ':tools: Creating Debug Report', description: 'Your debug report is being generated' }));
        require('../../modules/methods/generateDebug')(bot)
            .then(url => {
                msg.edit(Embed({
                    title: ':white_check_mark: Debug Report Created', description: 'Please send this URL to the Corebot Support Team:\n' + url
                }))
            })
    },
    description: "Create a Corebot Debug Report",
    usage: "debug",
    aliases: []
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706