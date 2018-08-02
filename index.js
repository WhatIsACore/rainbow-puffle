const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '.cp';

// channel ids:
// 447974253288095745: bot testing grounds
// 473349078013444096: stever 4 memes and dreams

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} on hour ${new Date().getHours()}!`);
  client.user.setActivity('Club Penguin');

  // daily cp meme
  if(new Date().getHours() === 0){
    sendDailyMeme('473349078013444096');
  }
  client.setInterval(function(){
    if(new Date().getHours() === 0){
      sendDailyMeme('473349078013444096');
    }
  }, 1000 * 60 * 60); // 1000 * 60 * 60
});

client.on('message', msg => {
  if(msg.author.username === 'WhatIsACore' && msg.author.discriminator === '6858' && msg.content === 'channel')
    console.log(msg.channel.id);

  if(msg.content.slice(0, prefix.length) === prefix){
    var args = msg.content.slice([prefix.length]).split(' ');
    var cmd = args[1];

    switch (cmd){
      case 'help':
        msg.reply('go help yourself');
        break;
      case 'ping':
        msg.reply('pong');
        break;
      case 'meme':
        var url = 'https://whatisacore.github.io/cpmemes/' + memesList[Math.floor(Math.random() * memesList.length)];
        msg.reply({files: [url]});
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



function sendDailyMeme(server){
  var url = 'https://whatisacore.github.io/cpmemes/' + memesList[Math.floor(Math.random() * memesList.length)];
  client.channels.get(server).send('today\'s club penguin meme:', {files: [url]});
}

var memesList = [
  'ayy lmao.png',
  'bad penguiz.jpg',
  'berry rude.jpg',
  'birmingham.jpg',
  'bodies.jpg',
  'breaking bad.jpg',
  'cannibalism.jpg',
  'casting.jpg',
  'coffee.jpg',
  'coin.png',
  'crossover.png',
  'crystal ball.jpeg',
  'cult.png',
  'cum here.webp',
  'dicks.png',
  'dildo.png',
  'dont let go.jpg',
  'fbi.jpg',
  'freedom.jpg',
  'gang.jpg',
  'global warming.jpg',
  'growing up.jpg',
  'hug.png',
  'i could kill u right now.jpg',
  'jews.jpg',
  'kkk.png',
  'lava.jpg',
  'locked up.jpg',
  'magnets.png',
  'money.jpg',
  'new chef.jpg',
  'niggerhentai.png',
  'nine one one.jpg',
  'no one cares.jpg',
  'no she meant me.jpg',
  'ok.png',
  'oppression.png',
  'peng-win.jpg',
  'pirate hitler.png',
  'puffle.png',
  'return of christ.jpg',
  'rip.jpg',
  'romeo.jpg',
  'rub it.jpg',
  'safe.jpg',
  'secret agent.jpg',
  'shit.jpg',
  'snow.jpg',
  'stop communism.png',
  'stop screaming.jpeg',
  'stranded.jpg',
  'strangerdanger.jpg',
  'stud.jpg',
  'suicide.jpg',
  'swastika.png',
  'taco bell supreme combo.png',
  'tampons.jpg',
  'thank you all for coming.jpg',
  'that\'s not on the menu.jpg',
  'third flipper.jpg',
  'tyrone.jpg',
  'unstable.jpg',
  'waddlin funny.jpg',
  'weeaboo.jpg',
  'weed.jpg',
  'what men really want.jpg',
  'what the fuck purple.jpg',
  'WHAT??????????!!!!!!!!!!.jpg',
  'which is cooler.png'
];
