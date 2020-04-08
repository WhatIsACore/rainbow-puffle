const Discord = require('discord.js');
const client = new Discord.Client();

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


// channel ids:
// 447974253288095745: bot testing grounds
// 473349078013444096: stever 4 memes and dreams
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

        msg.channel.send(msg.channel.id);
        break;

      case 'kick':

        const user = msg.mentions.users.first();
        if(user){
          const member = msg.guild.member(user);
          if(member)
            member.kick().then(() => {
              msg.channel.send('yes sir');
            }).catch(err => {
              msg.channel.send('i failed :(');
              console.error(err);
            });
        }
        break;

      default:
        msg.channel.send('umm idk');
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
      default:
        msg.reply('idk what that means, try ' + prefix + 'help');
    }
  }
});

client.login('Njk3MzE1MjI0MDYzMDQ5NzUx.Xo1gIg.eWU2Ni4-3ky_nr8SuYPvRtyUhII');

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

serv.listen(process.env.PORT || 5000);
