const Discord = require('discord.js');
const client = new Discord.Client();

var config;
try {
  config = require('./config');
} catch(e){
  config = process.env;
}

var prefix = '!';
const korean = /[\u3131-\uD79D]/ugi;
var cache = [];
function circ(key, value){
  if(typeof value === 'object' && value !== null) {
    if(cache.indexOf(value) !== -1) return;
    cache.push(value);
  }
  return value;
}

var prefixes = ['mal', 'abb', 'all', 'max', 'tan', 'zek', 'baek', 'al', 'harr', 'vict', 'don'];
var suffixes = ['ia', 'by', 'ison', 'ax', 'an', 'eki', 'hyun', 'ex', 'ry', 'toria', 'ald'];
var lastNames = ['serafin', 'louie', 'phan', 'doong', 'hua', 'xu', 'byun', 'cohen', 'styles', 'justice', 'trump'];
var n = prefixes.length;

function ship(){
  var a = Math.floor(Math.random() * n);
  var b = Math.floor(Math.random() * n);
  while(a == b) b = Math.floor(Math.random() * n);
  return (prefixes[a] + suffixes[b])
    .replace('bbb', 'bb')
    .replace('rrr', 'rr')
    + ' ' + lastNames[a][0] + '. ' + lastNames[b];
}

var screenshareLink = 'https://www.discordapp.com/channels/697310659112730746/697310659695607811';


// channel ids:
// 447974253288095745: bot testing grounds
// 697310659695607810: tanratz

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} on hour ${new Date().getHours()}!`);
  client.user.setActivity('Club Penguin');
});

client.on('message', msg => {

  if(msg.author.username === 'Groovy' && msg.author.discriminator === '7254'){
    if(JSON.stringify(msg, circ).match(korean) != null) msg.channel.send('ew kpop ;(');
    cache = [];
  }

  if(msg.author.username === 'zeki' && msg.author.discriminator === '6858' && msg.content.slice(0, 4) === 'sudo'){
    var content = msg.content.substring(5);
    var args = content.split(' ');
    var cmd = args[0];

    var channel = msg.channel;

    switch (cmd){
      case 'channel':

        channel.send(channel.id);
        break;

      case 'kick':

        const user = msg.mentions.users.first();
        if(user){
          const member = msg.guild.member(user);
          if(member)
            member.kick().then(() => {
              channel.send('yes sir');
            }).catch(err => {
              channel.send('i failed :(');
              console.error(err);
            });
        }
        break;

      default:
        channel.send('umm idk');
    }
  }

  if(msg.content.slice(0, prefix.length) === prefix){
    var content = msg.content.substring(prefix.length);
    var channel = msg.channel;
    var args = content.split(' ');
    var cmd = args[0];

    switch (cmd){
      case 'help':
        msg.reply('hahahahaha fuck you');
        break;
      case 'ping':
        msg.reply('pong');
        break;
      case 'isclubpenguinback':
        msg.reply('no ;(');
        break;
      case 'ship':
        channel.send(ship());
        break;
      case 'screenshare':
      case 'call':
        msg.reply(screenshareLink);
        break;
      default:
        msg.reply('idk what that means, try ' + prefix + 'help');
    }
  }
});

client.login(config.token);

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

serv.listen(process.env.PORT || 5000);
