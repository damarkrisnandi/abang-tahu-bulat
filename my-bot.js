const Discord = require('discord.js');
const bot = new Discord.Client();
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

bot.on("message", (message) => {
    let prefix = 'bang';
    if (message.content === 'cek') {
        message.reply('oke mantap');
    }
    if (message.content === prefix + ' gelut kuy' ||
    message.content === prefix.toLowerCase + ' gelut kuy' ) {
        message.channel.reply('kuy!');
    }
}
)

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = "NTgyMjQyMDYwMzk3MDUxOTE3.XOq_pQ.LAPntgRCPT9e1JE4cVbhJW66mwk"

bot.login(bot_secret_token)