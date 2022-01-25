const Utils = require('../modules/utils.js');
const config = Utils.variables.config;
const lang = Utils.variables.lang;

module.exports = async (bot, channel) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!channel.guild || !config.Logs.Enabled.includes("ChannelDeleted")) return;
        
        let Tickets = await Utils.variables.db.get.getTickets();
        let Applications = await Utils.variables.db.get.getApplications();
        let IDs = [...Tickets.map(ticket => ticket.channel_id), ...Applications.map(application => application.channel_id)];

        if (IDs.includes(channel.id)) return;
        
        const logs = Utils.findChannel(config.Logs.Channels.ChannelDeleted, channel.guild);

        if (logs) logs.send(Utils.Embed({
            title: lang.LogSystem.ChannelDeleted.Title,
            fields: [
                {
                    name: lang.LogSystem.ChannelDeleted.Fields[0],
                    value: channel.name
                },
                {
                    name: lang.LogSystem.ChannelDeleted.Fields[1],
                    value: channel.type.charAt(0).toUpperCase() + channel.type.substring(1)
                }
            ]
        }))
    }
}
// 239232   RCE__%%   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706