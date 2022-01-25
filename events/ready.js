const Utils = require('../modules/utils.js');
const variables = Utils.variables;
const fs = require('fs');
const chalk = require("chalk");
const request = require('request-promise');
const config = variables.config;

module.exports = async (bot) => {
    // GENERATE REPORT
    require('../modules/methods/generateReport')(bot);

    const botStatus = await variables.db.get.getStatus() || { activity: 'CoreBot', type: 'Playing' };
    if (config.ActivityCycling.Enabled) {
        let pos = 0;
        async function nextStatus() {
            let status;
            if (config.ActivityCycling.Type == 'ordered') {
                if (pos > (config.ActivityCycling.Activities.length - 1)) pos = 0;
                status = config.ActivityCycling.Activities[pos];
                pos++;
            } else if (config.ActivityCycling.Type == 'random') status = config.ActivityCycling.Activities[Math.floor(Math.random() * config.ActivityCycling.Activities.length)];

            if (Array.isArray(status)) {
                if (status.length == 2) await variables.db.update.status.setStatus(status[0], status[1]);
                else await variables.db.update.status.setStatus("playing", status[0]);
            } else await variables.db.update.status.setStatus("playing", status)
        }

        // Set the bot's status
        nextStatus();
        setInterval(nextStatus, config.ActivityCycling.Time * 1000)
    } else setInterval(async () => {
        const botStatus = await variables.db.get.getStatus() || { activity: 'CoreBot', type: 'Playing' };
        variables.db.update.status.setStatus(botStatus.type, botStatus.activity)
    }, 5000)

    console.log("\x1b[0m", `#---------------------------------------------------------------------------#`);
    console.log('\x1b[32m', `                         CoreBot v${variables.config.BotVersion} is now ONLINE!`);
    console.log("\x1b[36m", `                       Thank you for purchasing CoreBot!`);
    console.log(' ');
    console.log(`${chalk.hex("#ffc042")(`              Have any issues? Join our Discord server for support!`)}`);
    console.log("\x1b[0m", `                          https://corebot.dev/support/`);
    console.log("\x1b[0m", `#---------------------------------------------------------------------------#`);


    // Giveaways
    const GiveawayHandler = await require('../modules/handlers/GiveawayHandler.js')(bot);
    setInterval(async function () {
        GiveawayHandler(bot);
    }, 60000);

    // Invites
    variables.set('invites', {});
    bot.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            variables.invites[g.id] = guildInvites;
        });
    });

    // Activation System
    if (!fs.existsSync("./commands") || !variables.config.Key || variables.config.Key == "BOT-KEY-HERE") {
        console.log('\x1b[91m%s\x1b[0m', '[WARNING] CoreBot is not activated. Please make sure you have put your key into the Key section in the config. If it is, then corebot will activate within the next few seconds.');
    }

    // ADDON HANDLER
    const AddonHandler = require('../modules/handlers/AddonHandler').init(bot);

    // Backup System
    if (variables.config.Other.SQLiteDatabaseBackups && !Utils.getStartupParameters().includes("disable-backups")) {
        function backup() {
            if (variables.config.Storage.Type.toLowerCase() == 'sqlite') {
                Utils.backup(['database.sqlite'])
                    .catch(err => {
                        console.log(`[ERROR | BACKUP SYSTEM] ERROR: ` + err);
                    })
                    .then(() => {
                        console.log(Utils.backupPrefix + 'Files backed up at ' + new Date().toLocaleString());
                    })
            }
        }
        backup();
        setInterval(backup, 43200000)
    }

    // Key Handler
    try {
        require('../modules/handlers/KeyHandler.js').init();
    } catch (err) {
        console.log('ERROR CODE 10014');
        process.exit();
    }
    // Status advertisement Handler
    const StatusAdvertisementHandler = await require('../modules/handlers/StatusHandler.js')(bot);

    if (config.Logs.Enabled.includes("Chat") && !fs.existsSync('./logs/')) await fs.mkdirSync('./logs/', function (err) {
        if (err) throw err;
    });

    let ModerationModule = await Utils.variables.db.get.getModules("mod");
    let MuteCommand = await Utils.variables.db.get.getCommands("mute");
    if (ModerationModule && MuteCommand && ModerationModule.enabled && MuteCommand.enabled) {
        bot.guilds.cache.forEach(guild => {
            let muteRole = Utils.findRole(config.Moderation.MuteRole, guild)
            if (!muteRole) return;
            guild.channels.cache.filter(ch => ch.permissionsFor(muteRole).has("SEND_MESSAGES")).forEach(ch => {
                ch.createOverwrite(muteRole, {
                    SEND_MESSAGES: false
                })
            })
        })
    }

    if (bot.guilds.cache.size == 1) {
        console.log(Utils.infoPrefix + "Your bot is currently in " + chalk.bold(1) + " server!")
    } else if (bot.guilds.cache.size == 0) {
        console.log(Utils.warningPrefix + "Your bot is currently in " + chalk.bold(0) + " servers! This may cause errors in console. Please invite the bot to your server!")
    } else {
        console.log(Utils.warningPrefix + "Your bot is currently in " + chalk.bold(bot.guilds.cache.size) + " servers! Corebot is not made for multiple servers, so there may be various bugs.")
    }

    if (config.AutoAnnouncements.Enabled) {
        config.AutoAnnouncements.Announcements.forEach(announcement => {
            let announcer = async () => {
                let channel = Utils.findChannel(announcement.Channel, bot.guilds.cache.first());

                if (!channel) return;

                let lastMessage = channel.lastMessage;

                if (announcement.Type == "embed" && announcement.Embed) {
                    let embed = Utils.setupEmbed({
                        configPath: announcement.Embed
                    })

                    if (lastMessage && lastMessage.embeds.length && lastMessage.author.id == bot.user.id) {
                        if (lastMessage.embeds[0].title && embed.title && embed.title == lastMessage.embeds[0].title) return;
                        if (lastMessage.embeds[0].description && embed.description && embed.description == lastMessage.embeds[0].description) return;
                    }

                    channel.send(embed)
                } else if (announcement.Content) {
                    if (lastMessage && lastMessage.content == announcement.Content && lastMessage.author.id == bot.user.id) return;
                    channel.send(announcement.Content)
                }
            }

            announcer()
            setInterval(announcer, announcement.Interval * 1000)
        })
    }

    let CommandHandler = require("../modules/handlers/CommandHandler").commands
    let SuggestCMD = CommandHandler.find(command => command.command == "suggest")
    let SNoteCMD = CommandHandler.find(command => command.command == "snote")
    let BugReportsCMD = CommandHandler.find(command => command.command == "bugreport")
    let TempChannelCMD = CommandHandler.find(command => command.command == "tempchannel")

    if (SuggestCMD) {
        if (!config.Suggestions.Enabled || (config.Suggestions.Enabled && config.Suggestions.Type.toLowerCase() == "send-message")) {
            SuggestCMD.enabled = false
            await Utils.variables.db.update.commands.setCommand("suggest", false)
        } else {
            SuggestCMD.enabled = true
            await Utils.variables.db.update.commands.setCommand("suggest", true)
        }
    }

    if (SNoteCMD) {
        if (config.Suggestions.Enabled) {
            SNoteCMD.enabled = true
            await Utils.variables.db.update.commands.setCommand("snote", true)
        } else {
            SNoteCMD.enabled = false
            await Utils.variables.db.update.commands.setCommand("snote", false)
        }
    }

    if (BugReportsCMD) {
        if (!config.BugReports.Enabled || (config.BugReports.Enabled && config.BugReports.Type.toLowerCase() == "send-message")) {
            BugReportsCMD.enabled = false
            await Utils.variables.db.update.commands.setCommand("bugreport", false)
        } else {
            BugReportsCMD.enabled = true
            await Utils.variables.db.update.commands.setCommand("bugreport", true)
        }
    }

    if (TempChannelCMD) {
        if (config.TempChannels.Enabled) {
            TempChannelCMD.enabled = true
            await Utils.variables.db.update.commands.setCommand("tempchannel", true)
        } else {
            TempChannelCMD.enabled = false
            await Utils.variables.db.update.commands.setCommand("tempchannel", false)
        }
    }
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706