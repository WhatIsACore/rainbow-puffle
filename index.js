const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '.cp';

// channel ids:
// 447974253288095745: bot testing grounds
// 473349078013444096: stever 4 memes and dreams

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} on hour ${new Date().getHours()}!`);
  client.user.setActivity('Club Penguin');

  /**
  // daily cp meme
  if(new Date().getHours() === 4 && !sentMemeToday){
    sendDailyMeme('473349078013444096');
  }
  client.setInterval(function(){
    if(new Date().getHours() === 4 && !sentMemeToday){
      sendDailyMeme('473349078013444096');
    } else {
      sentMemeToday = false;
    }
  }, 1000 * 60 * 60); // 1000 * 60 * 60
  **/
});

client.on('message', msg => {
  if(msg.author.username === 'zeki' && msg.author.discriminator === '6858' && msg.content === 'channel')
    console.log(msg.channel.id);

  if(msg.content.slice(0, prefix.length) === prefix){
    var args = msg.content.slice([prefix.length]).split(' ');
    var cmd = args[1];

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
        msg.reply('idk what that means, try ' + prefix + ' help');
    }
  }
});

client.login('NDczNjAyMDI1NTQ0ODc2MDQy.DkEUAw.BAPCnVx8JrW8fepYWL96S2Lrs28');

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

serv.listen(process.env.PORT || 5000);
