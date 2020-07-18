'use strict';

// rainbow puffle (best bot) source code

const Discord = require('discord.js');
const client = new Discord.Client();

let message = require('./message');
let admin = require('./admin');
let database = require('./database');

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

  // complain whenever Groovy plays kpop
  if(msg.author.username === 'Groovy' && msg.author.discriminator === '7254'){
    if(JSON.stringify(msg, circ).match(korean) != null) msg.channel.send('ew kpop ;(');
    cache = [];
  }

  // heart react mudae
  if(msg.author.username === 'Mudae' && msg.author.discriminator === '0807'){
    if(JSON.stringify(msg, circ).indexOf('REACT with') != -1)
      msg.react('❤️');

    if(msg.content.indexOf('Congratulations, you won an uncommon nothing.') != -1)
      database.addL(msg);
  }

  // zeki's super secret admin commands hehe
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
const korean = /[\u3131-\uD79D]/ugi;
var cache = [];
function circ(key, value){
  if(typeof value === 'object' && value !== null) {
    if(cache.indexOf(value) !== -1) return;
    cache.push(value);
  }
  return value;
}
