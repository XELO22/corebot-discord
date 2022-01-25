const Utils = require('../../modules/utils');
const Embed = Utils.Embed;
const { config, lang } = Utils.variables;

const getEmoji = choice => {
    return choice == 'rock' ? '⛰️' : choice == 'scissors' ? '✂️' : '🧻' 
}

capitalize = str => {
    return str.charAt(0).toUpperCase() + str.substring(1);
}

module.exports = {
    name: "rockpaperscissors",
    run: async (bot, message, args) => {
        if (!args.length) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));

        let choices = ['rock', 'paper', 'scissors']
        let choice = args[0].toLowerCase()


        if (!choices.includes(choice)) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));

        choices.splice(choices.indexOf(choice), 1);

        let botsChoice = choices[~~(Math.random() * choices.length)];

        let winner;

        if (botsChoice == 'rock' && choice == 'paper') winner = message.author
        if (botsChoice == 'rock' && choice == 'scissors') winner = bot.user

        if (botsChoice == 'paper' && choice == 'scissors') winner = message.author
        if (botsChoice == 'paper' && choice == 'rock') winner = bot.user

        if (botsChoice == 'scissors' && choice == 'rock') winner = message.author
        if (botsChoice == 'scissors' && choice == 'paper') winner = bot.user


        message.channel.send(Embed({
            title: lang.FunModule.Commands.RockPaperScissors.Title,
            description: lang.FunModule.Commands.RockPaperScissors.Description.replace(/{you}/g, `${capitalize(choice)} ${getEmoji(choice)}`).replace(/{bot}/g, `${capitalize(botsChoice)} ${getEmoji(botsChoice)}`).replace(/{user}/g, `<@${winner.id}>`)
        }))

    },
    description: "Rock paper scissors game",
    usage: "rps <rock/paper/scissors>",
    aliases: ['rps']
}
// 239232   8501   NCE__%%    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706