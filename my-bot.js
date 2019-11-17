const Discord = require('discord.js');
const dataMessage = require('./message.json');
const config = require("./config.json");
const axios = require('axios');


const bot = new Discord.Client();
bot.on("ready", async () => {
    console.log('---ready---');
    console.log(await meme());
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

// VARIABEL BUAT MAIN GAME
const ularTangga = require('./ular-tangga.json');
const board = ularTangga;
let player = [];
let turn = 1;
let playOn = false;

bot.on('message', message => {
    var prefix = config.prefix;
    var umpat = ['sat', 'ke'];
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

                case 'meme':
                    var bikinMeme = (await meme());
                    message.reply(generateImage(bikinMeme.url, 'MAS BAMBANG', bikinMeme.title));
                    break;

                default:
                    message.reply(msg.reply);
                    break;
            }
        }
    });

    ularTanggaGame(message, prefix);
});


function ularTanggaGame(message, prefix) {
    // player registration
    if (!isExistPlayer(message.author.username) && !playOn &&
        message.content.toLowerCase() === (prefix + ' ular-tangga')) {
        player.push({ name: message.author.username, pos: 0 });
        console.log(player);
        message.channel.send(generatePlayer(player.length, 'Terdaftar: ' + message.author.username + `, gunakan command 'ut mulai' untuk memulai permainan (player 1). Mohon tunggu pemain lain jika ingin bermain mode multiplayer`));
    } else if (isExistPlayer(message.author.username) && message.content.toLowerCase() === (prefix + ' ular-tangga')) {
        message.channel.send(generateTextEmbed('ULAR TANGGA', 'anda sudah terdaftar sebagai player ' + 
        (player.findIndex(p => {
            return p.name === message.author.username;
        }) + 1)));
    }

    var gamePrefix = "ut";

    // start the game
    if (player.length > 0 && 
        player.map(item => item.name).includes(message.author.username) &&
        message.content.toLowerCase() === (gamePrefix + ' mulai')) {
        playOn = true;
        message.channel.send(generateTurn(turn, `giliran ${player[(turn - 1) % player.length].name}, gunakan command 'ut dice'`));
    }

    // terminate the game
    if (message.content.toLowerCase() === (gamePrefix + ' close')) {
        player = [];
        turn = 1;
        playOn = false;
        message.channel.send(generateTextEmbed('ULAR TANGGA', 'PERMAINAN DIHENTIKAN'));
    }

    if (player.length > 0) {
        // one turn cycle 
        if (player[(turn - 1) % player.length] &&
            message.author.username === player[(turn - 1) % player.length].name &&
            player[(turn - 1) % player.length].pos < board.length - 1 &&
            message.content.toLowerCase() === (gamePrefix + ' dice')) {
            let move = lemparDadu();
            player[(turn - 1) % player.length].pos += move;
            message.channel.send(generateTurn(turn, `${player[(turn - 1) % player.length].name} maju sebanyak ${move}. Posisi ${player[(turn - 1) % player.length].name} sekarang ada di pos no. ${player[(turn - 1) % player.length].pos} `));
            
            if (player[(turn - 1) % player.length].pos < 30) {
                message.channel.send(generateTextEmbed("KOMENTATOR ULAR TANGGA",
                    board[player[(turn - 1) % player.length].pos].msg + '. ' +
                    `. Posisi ${player[(turn - 1) % player.length].name} sekarang ada di pos no. ${player[(turn - 1) % player.length].pos + board[player[(turn - 1) % player.length].pos].move} `));
                player[(turn - 1) % player.length].pos += board[player[(turn - 1) % player.length].pos].move;

                turn += 1;
                message.channel.send(generateTurn(turn, `giliran ${player[(turn - 1) % player.length].name}, gunakan command 'ut dice'`));
            } else {
                player[(turn - 1) % player.length].pos = 30;
                message.channel.send(generateTextEmbed("KOMENTATOR ULAR TANGGA", `${player[(turn - 1) % player.length].name} MENANG!!`));
                player = [];
                turn = 1;
                playOn = false;
            }

        } else {
            playOn = false;
        }
    }
    return;
}

function isExistPlayer(inputPlayer) {
    let a = false;
    for (const p of player) {
        if (p.name === inputPlayer) {
            a = true;
            break;
        }
    }
    return a;
}

function lemparDadu() {
    return Math.round((Math.random() * 5) + 1);
}

function cycleNumber(i, n) {
    if (i !== n) {
        return i + 1
    } else {
        return 1
    }
}


async function meme() {
    data = (await axios.get('https://meme-api.herokuapp.com/gimme')).data
    return data;
}

async function getQuotes() {
    var num = [0, 1, 2, 3]
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
function generatePlayer(num, name) {
    return generateTextEmbed("Player " + num, name)
}

function generateTurn(num, name) {
    return generateTextEmbed("Turn " + num, name)
}

function generateTextEmbed(title, detail) {
    const embed = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setTimestamp()
        .addField(title, detail)
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