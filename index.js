'use strict';

// rainbow puffle (best bot) source code

const Discord = require('discord.js');
const client = new Discord.Client();

let message = require('./message');
let admin = require('./admin');
let database = require('./database');
let toxic = require('./toxic');

var config;
try {
  config = require('./config');
} catch(e){
  config = process.env;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} on hour ${new Date().getHours()}!`);
  client.user.setActivity('Club Penguin');
});

client.on('message', msg => {
  if(
    !msg.author.bot &&
    msg.content.slice(0, 1) !== message.prefix &&
    msg.content.slice(0, 1) !== '$'
  ) toxic.analyze(msg);

  // complain whenever Groovy plays kpop & praise whenever Groovy plays japanese music
  if(msg.author.username === 'Groovy' && msg.author.discriminator === '7254'){
    if(JSON.stringify(msg, circ).match(korean_char) != null) msg.channel.send('ew kpop ;(');
    cache = [];
    if(JSON.stringify(msg, circ).match(japanese_char) != null) msg.channel.send('uwu, jpop :>');
    cache = [];
  }

  // heart react mudae
  if(msg.author.username === 'Mudae' && msg.author.discriminator === '0807')
    if(JSON.stringify(msg, circ).indexOf('REACT with') != -1)
      msg.react('❤️');

  // L tracker
  if((msg.author.username === 'Mudae' && msg.author.discriminator === '0807') || (msg.author.username === 'Mudamaid 56' && msg.author.discriminator === '3601'))
    if(msg.content.indexOf('Congratulations, you won an uncommon nothing.') != -1){
      var loser;
      if(msg.mentions.users.first() != null){
        loser = msg.mentions.users.first();
      } else {
        var nickname = msg.content.split('\n').pop().split(' ')[0].slice(0, -1);
        loser = msg.channel.members.filter((member) => {
          return member.user.username == nickname
        }).first().user;
      }
      database.addL(loser, msg.channel);
    }

  // interesting
  if(msg.content.toLowerCase() == 'interesting')
    if(msg.author.username === 'fuji_rinngo' && msg.author.discriminator === '9845'){
      msg.channel.send({
        files: ['https://i.imgur.com/ekiVU6G.jpg']
      });
    } else msg.channel.send({
      files: ['https://i.imgur.com/VZfswTP.jpg']
    });

  if(msg.content.toLowerCase() == 'inch resting')
    msg.channel.send({
      files: ['https://i.imgur.com/hNfmUVt.jpg']
    });

  // zeki's super secret admin commands
  if(msg.content.slice(0, 1) === admin.prefix){
    var content = msg.content.substring(1);
    admin.process(msg, content);
  }

  // normal command matching
  if(msg.content.slice(0, message.prefix.length) === message.prefix){
    var content = msg.content.substring(message.prefix.length);
    message.process(msg, content);
  }
});

client.login(config.token);

// web server to send requests and make heroku happy
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

serv.listen(config.PORT || 5000);



// korean matching regex
const korean_char =/[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]/ugi;
const japanese_char =/[\u3000-\u303f\u3040-\u309f]/ugi;
var cache = [];
function circ(key, value){
  if(typeof value === 'object' && value !== null) {
    if(cache.indexOf(value) !== -1) return;
    cache.push(value);
  }
  return value;
}
