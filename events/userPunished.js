const Utils = require("../modules/utils.js");
const { config, lang } = Utils.variables;
const { capitalize } = require("lodash");

module.exports = async (bot, punishment, user, executor) => {
    if (!config.Moderation.Logs.Enabled) return;

    let logs = Utils.findChannel(config.Moderation.Logs.Channel, user.guild);
    let id = await Utils.variables.db.get.getPunishmentID()
    if (!logs) return;

    if (punishment.type.startsWith("temp")) {
        logs.send(Utils.Embed({
            title: lang.ModerationModule.Logs.UserTempPunished.Title,
            footer: lang.ModerationModule.Logs.UserTempPunished.Footer.replace(/{id}/g, id),
            timestamp: punishment.time,
            fields: [
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[0], value: user },
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[1], value: executor },
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[2], value: capitalize(punishment.type) },
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[3], value: punishment.reason },
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[4], value: Utils.DDHHMMSSfromMS(punishment.length) }
            ]
        }))
    } else if (punishment.type == "warn") {
        logs.send(Utils.Embed({
            title: lang.ModerationModule.Logs.UserWarned.Title,
            footer: lang.ModerationModule.Logs.UserWarned.Footer.replace(/{id}/g, punishment.id),
            timestamp: punishment.time,
            fields: [
                { name: lang.ModerationModule.Logs.UserWarned.Fields[0], value: user },
                { name: lang.ModerationModule.Logs.UserWarned.Fields[1], value: executor },
                { name: lang.ModerationModule.Logs.UserWarned.Fields[2], value: "Warn" },
                { name: lang.ModerationModule.Logs.UserWarned.Fields[3], value: punishment.reason },
                { name: lang.ModerationModule.Logs.UserWarned.Fields[4], value: punishment.warnCount }
            ]
        }))
    } else {
        logs.send(Utils.Embed({
            title: lang.ModerationModule.Logs.UserPunished.Title,
            timestamp: punishment.time,
            footer: lang.ModerationModule.Logs.UserPunished.Footer.replace(/{id}/g, id),
            fields: [
                { name: lang.ModerationModule.Logs.UserPunished.Fields[0], value: user },
                { name: lang.ModerationModule.Logs.UserPunished.Fields[1], value: executor },
                { name: lang.ModerationModule.Logs.UserPunished.Fields[2], value: capitalize(punishment.type) },
                { name: lang.ModerationModule.Logs.UserPunished.Fields[3], value: punishment.reason }
            ]
        }))
    }
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706