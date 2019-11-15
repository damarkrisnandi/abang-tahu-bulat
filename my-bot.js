const Discord = require('discord.js');
const dataMessage = require('./message.json');
const config = require("./config.json");
const axios = require('axios');

const bot = new Discord.Client();
bot.on("ready", async () => {
    console.log('masuk');
    console.log((await gambarKucing()));
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
        if (message.content.toLowerCase() === pesan) {
            switch (msg.msg) {
                case 'quote':
                    var quote = (await getQuotes());
                    message.reply(generateQuote(quote))
                    break;
                
                case 'kucing':
                    var cat = (await gambarKucing());
                    message.reply(generateImage(cat, "NIH GAMBAR KUCING BUAT LO", "NIH GAMBAR KUCING BUAT LO"))
                    break;

                default:
                    message.reply(msg.reply);
                    break;
            }
        }
    });
})

async function getQuotes() {
    var num = [0,1,2,3]
    rand = Math.round(Math.random() * (num.length - 1));
    try {
        switch (rand) {
            case 0:
                console.log('http://api.icndb.com/jokes/random/');
                return (await axios.get('http://api.icndb.com/jokes/random/')).data.value.joke;       
                break;
            case 1:
                console.log('https://geek-jokes.sameerkumar.website/api');
                return (await axios.get('https://geek-jokes.sameerkumar.website/api')).data;       
                break;
            case 2:
                console.log('https://api.tronalddump.io/random/quote');
                    return (await axios.get('https://api.tronalddump.io/random/quote')).data.value;       
                    break;
            case 3:
                console.log('https://api.quotable.io/random');
                    var quoteData = (await axios.get('https://api.quotable.io/random')).data;
                    return quoteData.content + ' - ' + quoteData.author;       
                    break;
            case 3:
                console.log('https://api.quotable.io/random');
                    return (await axios.get('https://api.quotable.io/random')).data.value;       
                    break;
            default:
                return (await axios.get('http://api.icndb.com/jokes/random/')).data.value.joke;
                break;
        }
        
    } catch (error) {
        console.log(error);
        return (error)
    }
}

async function gambarKucing() {
    return (await axios.get("https://aws.random.cat/meow?ref=apilist.fun")).data.file;
}

function generateQuote(message) {
    const embed = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setTimestamp()
        .addField("MAS BAMBANG", message)
    return embed;
}

function generateImage(url, title, caption) {
    const embed = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setTimestamp()
        .addField(title, caption)
        .setImage(url)
    return embed;
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = config.token
bot.login(bot_secret_token)