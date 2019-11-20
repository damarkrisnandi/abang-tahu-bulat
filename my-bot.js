const Discord = require('discord.js');
const dataMessage = require('./message.json');
const config = require("./config.json");
const axios = require('axios');


const bot = new Discord.Client();
bot.on("ready", async () => {
    console.log('---ready---');
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
let playOn = 0;

bot.on('message', message => {
    var prefix = config.prefix;
    var umpat = ['sat', 'ke'];
    dataMessage.forEach(async (msg) => {
        var pesan = prefix + ' ' + msg.msg;
        if (message.content.toLowerCase() === pesan) {
            switch (msg.msg) {
                case 'quote':
                    var quote = (await getQuotes());
                    message.channel.send(generateQuote(quote))
                    break;

                case 'kucing':
                    var cat = (await gambarKucing());
                    message.channel.send(generateImage(cat, "NIH GAMBAR KUCING BUAT LO", "NIH GAMBAR KUCING BUAT LO"))
                    break;

                case 'meme':
                    var bikinMeme = (await meme());
                    message.channel.send(generateImage(bikinMeme.url, 'MAS BAMBANG', bikinMeme.title));
                    break;

                default:
                    message.reply(msg.reply);
                    break;
            }
        }
    });

    if (message.content.split(' ').length > 1 &&
        message.content.split(' ')[0].toLowerCase() === prefix &&
        umpat.includes(message.content.split(' ')[1].toLowerCase())) {
        const react = ['JANCUK', 'NGAJAK BERANTEM?', 'GELUT KUY!', 'ANAK MANA LO!', 'DASAR JAMBAN', 'TAEK', 'BANGSAT'];
        message.reply(react[Math.round(Math.random() * (react.length - 1))]);
    }

    // let's play the game #1
    ularTanggaGame(message, prefix);

    // let's play the game #2
    quizGame(message, prefix);

    if ((message.content.toLowerCase()).includes('bangsat')) {
        message.reply('hey dasar goblog');
    }
});


function ularTanggaGame(message, prefix) {
    playerRegistration(message, prefix, 'ular-tangga', `gunakan command 'ut mulai' untuk memulai permainan (player 1). Mohon tunggu pemain lain jika ingin bermain mode multiplayer`);

    var gamePrefix = "ut";

    if (player.length > 0 && player.map(item => item.name).includes(message.author.username)) {
        // start the game
        if (playOn === 0 && message.content.toLowerCase() === (gamePrefix + ' mulai')) {
            playOn += 1;
            message.channel.send(generateTurn(turn, `giliran ${player[(turn - 1) % player.length].name}, gunakan command 'ut dice'`));
        }

        // terminate the game
        if (playOn === 1 && message.content.toLowerCase() === (gamePrefix + ' close')) {
            player = [];
            turn = 1;
            playOn -= 1;
            message.channel.send(generateTextEmbed('ULAR TANGGA', 'PERMAINAN DIHENTIKAN'));
        }

        // game info
        if (playOn === 1 &&
            message.content.toLowerCase() === (gamePrefix + ' info')) {
            message.channel.send(infoGame());
        }

        // one turn cycle 
        if (playOn === 1 &&
            player[(turn - 1) % player.length] &&
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
                playOn -= 1;
            }

        } else {
            
        }
    }
}

function quizGame(message, prefix) {
    playerRegistration(message, prefix, 'quiz', `gunakan command 'qz mulai' untuk memulai permainan (player 1). Mohon tunggu pemain lain jika ingin bermain mode multiplayer`);
    const gamePrefix = 'qz';
}

function playerRegistration(message, prefix, command, resp) {
    var games = ['ular-tangga', 'quiz']
    // player registration
    try {
        if (!isExistPlayer(message.author.username) && playOn === 0 &&
        message.content.toLowerCase() === `${prefix} ${command}`) {
        player.push({ name: message.author.username, pos: 0 });
        message.channel.send(generatePlayer(player.length, 'Terdaftar: ' + message.author.username + `, ` + resp ));
    } else if (isExistPlayer(message.author.username) && 
        message.content.toLowerCase() === `${prefix} ${command}`) {
        message.channel.send(generateTextEmbed('GAME MESSAGE', 'anda sudah terdaftar sebagai player ' +
            (player.findIndex(p => {
                return p.name === message.author.username;
            }) + 1)));
    }
    } catch (error) {
        console.log(error);
    }
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

function infoGame() {
    var embed = new Discord.RichEmbed()
    embed.title = "ULAR TANGGA";
    embed.color = 3447003;
    var position = ''
    for (const p of player) {
        if (p.pos === Math.max(player.map(item => item.pos))) {
            position = 'Saat ini masih memimpin permainan.'
        }
        embed.fields.push(
            {
                name: `Player ${(player.indexOf(p) + 1)} (${p.name})`,
                value: `berada di pos nomer ${p.pos}. ${position}`
            }
        )
    }

    return embed;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
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
                return (await axios.get('http://api.icndb.com/jokes/random/')).data.value.joke;
                break;
            case 1:
                return (await axios.get('https://geek-jokes.sameerkumar.website/api')).data;
                break;
            case 2:
                return (await axios.get('https://api.tronalddump.io/random/quote')).data.value;
                break;
            case 3:
                var quoteData = (await axios.get('https://api.quotable.io/random')).data;
                return quoteData.content + ' - ' + quoteData.author;
                break;
            case 3:
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
    return generateTextEmbed("MAS BAMBANG", message);
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
        .setTitle(title)
        .setDescription(detail)
    return embed;
}

function generateImage(url, title, caption) {
    const embed = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setTimestamp()
        .setTitle(title)
        .setDescription(caption)
        .setImage(url)
    return embed;
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = config.token
bot.login(bot_secret_token)