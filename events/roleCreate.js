const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, role) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!Utils.variables.config.Logs.Enabled.includes("RoleCreated")) return;

        const logs = Utils.findChannel(Utils.variables.config.Logs.Channels.RoleCreated, role.guild);

        if (logs) logs.send(Utils.Embed({
            title: lang.LogSystem.RoleCreated.Title,
            fields: [
                {
                    name: lang.LogSystem.RoleCreated.Field,
                    value: `<@&${role.id}>`
                }
            ]
        }))
    }
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706