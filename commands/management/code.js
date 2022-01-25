const Utils = require("../../modules/utils.js");
const Embed = Utils.Embed;
const config = Utils.variables.config;
const request = require('request-promise');

module.exports = {
    name: 'code',
    run: async (bot, message, args) => {
        request.post({
            uri: 'https://corebot.dev/getCode',
            headers: {
                'Authorization': config.Key
            },
            json: true
        })
            .then(res => {
                message.channel.send(Embed({ title: "Code", description: "Your code is ``" + res.code + "``. You can go to https://corebot.dev/code to see if this is a legitimate copy of Corebot. This will also show you the owner of the copy." }))
            })
    },
    description: "Users can use this to determine if you are using a legitimate copy of Corebot.",
    usage: 'code',
    aliases: []
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706