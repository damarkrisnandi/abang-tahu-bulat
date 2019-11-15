const Discord = require('discord.js');
const dataMessage = require('./message.json');
const config = require("./config.json");
const axios = require('axios');

const bot = new Discord.Client();
bot.on("ready", async () => {
    console.log('masuk');
    console.log((await getQuotes()).data.value.joke);
});

// message after invited
bot.on("guildCreate", guild => {
    let channelID;
    let channels = guild.channels;
    channelLoop:
    for (let c of channels) {
        let channelType = c[1].type;
        if (channelType === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }

    let channel = bot.channels.get(guild.systemChannelID || channelID);
    channel.send(`Hello sobat-sobat misqinku!`);
    channel.send('Assalamualaikum');
    channel.send('gak jawab pki');


});
// kondisi kalo ada pesan
bot.on('message', message => {
    var prefix = config.prefix;
    dataMessage.forEach(async (msg) => {
        var pesan = prefix + ' ' + msg.msg;
        if (message.content === pesan) {
            switch (msg.msg) {
                case 'quote':
                    var quote = (await getQuotes()).data.value.joke;
                    message.reply(generateQuote(quote))
                    break;

                default:
                    message.reply(msg.reply);
                    break;
            }
        }
    });
})

async function getQuotes() {
    try {
        return await axios.get('http://api.icndb.com/jokes/random/')
    } catch (error) {
        console.error(error)
    }
}

function generateQuote(message) {
    const embed = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setTimestamp()
        .addField("MAS BAMBANG", message)
    return embed;
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = config.token
bot.login(bot_secret_token)