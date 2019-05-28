const Discord = require('discord.js');
const dataMessage = require('./message.json');
const bot = new Discord.Client();
bot.on("ready", () => {
    console.log('masuk');
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
    var prefix = 'bang';
    dataMessage.forEach(msg => {
        var pesan = prefix +' '+ msg.msg;
        if (message.content === pesan) {
            message.reply(msg.reply);
        } 
    });
})

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = "NTgyMjQyMDYwMzk3MDUxOTE3.XOq_pQ.LAPntgRCPT9e1JE4cVbhJW66mwk"
bot.login(bot_secret_token)