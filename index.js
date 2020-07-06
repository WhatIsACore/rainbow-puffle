// rainbow puffle (best bot) source code

const Discord = require('discord.js');
const client = new Discord.Client();

var config;
try {
  config = require('./config');
} catch(e){
  config = process.env;
}

var prefix = '!';
var screenshareLink = 'https://www.discordapp.com/channels/697310659112730746/697310659695607811';

// make sure only people we like is using admin commands
var coolPeople = [
  ['zeki', '6858'],
  ['Supreme Leader', '3198']
]
function isCool(user){
  for(var p of coolPeople)
    if(user.username === p[0] && user.discriminator === p[1]) return true;
  return false;
}


// channel ids:
// 447974253288095745: bot testing grounds
// 697310659695607810: tanratz

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
  if(msg.author.username === 'Mudae' && msg.author.discriminator === '0807')
    if(JSON.stringify(msg, circ).indexOf('REACT with') != -1)
      msg.react('❤️');

  // zeki's super secret admin commands hehe
  if(msg.content.slice(0, 1) === '¬'){
    var content = msg.content.substring(1);
    var args = content.split(' ');
    var cmd = args[0];
    var channel = msg.channel;

    var coolPeopleCommands = ['makeRole', 'addRole', 'clearRole', 'admin', 'kick'];
    if(!isCool(msg.author))
      for(var a of coolPeopleCommands)
        if(cmd === a){
          sendCoolMsg(msg, 'sorry, I don\'t follow commands from total fucking losers');
          return;
        }

    switch (cmd){
      case 'channel':
        channel.send(channel.id);
        break;

      case 'roles':
        var roles = msg.member.roles.cache,
            res = '';
        for(var i of roles) res += i[1].name + '[' + i[0] + '] \n';
        sendCoolMsg(msg, res.replace(/@/g, '\\@'));
        break;

      case 'makeRole':
        msg.guild.roles.create({
          data: {
            name: args[1],
            color: args[2],
            permissions: parseInt(args[3]),
            hoist: args[4] === 'true' ? true : false
          }
        }).then(role => {
          if(args[5] === 'true'){
            var position = msg.guild.roles.cache.find(r => r.name === 'rainbowpuffle').position;
            role.setPosition(position - 1);
          }
          sendCoolMsg(msg, 'ok');
        }).catch(err => {
          sendCoolMsg(msg, 'i failed :(');
          console.error(err);
        });
        break;

      case 'addRole':
        var target = msg.mentions.members.first();
        var role = msg.guild.roles.cache.find(r => r.name === args[2]);
        if(target && role){
          target.roles.add(role).then(() => {
            sendCoolMsg(msg, 'ok');
          }).catch(err => {
            sendCoolMsg(msg, 'i failed :(');
            console.error(err);
          });
        } else sendCoolMsg(msg, 'could not find user or role');
        break;

      case 'clearRole':
        var target = msg.mentions.members.first();
        var role = msg.guild.roles.cache.find(r => r.name === args[2]);
        if(target && role){
          target.roles.remove(role).then(() => {
            sendCoolMsg(msg, 'ok');
          }).catch(err => {
            sendCoolMsg(msg, 'i failed :(');
            console.error(err);
          });
        } else sendCoolMsg(msg, 'could not find user or role');
        break;

      // instantly give me highest level of admin possible
      case 'admin':
        var target = msg.member;
        msg.guild.roles.create({
          data: {
            name: args[1] || 'admin',
            color: 'RED',
            permissions: 8,
            hoist: args[2] === 'true' ? true : false
          }
        }).then(role => {
          msg.member.roles.add(role).then(() => {
            sendCoolMsg(msg, 'ok');
          });
          var position = msg.guild.roles.cache.find(r => r.name === 'rainbowpuffle').position;
          role.setPosition(position - 1);
        }).catch(err => {
          sendCoolMsg(msg, 'i failed :(');
          console.error(err);
        });
        break;

      case 'kick':
        var target = msg.mentions.members.first();
        if(target){
          target.kick().then(() => {
            sendCoolMsg(msg, 'yes sir');
          }).catch(err => {
            sendCoolMsg(msg, 'i failed :(');
            console.error(err);
          })
        } else sendCoolMsg(msg, 'could not find user');
        break;

      case 'repeat':
        sendCoolMsg(msg, 'yes sir');
        setTimeout(() => {
          channel.send(msg.content.substring(8));
        }, 500);
        break;

      default:
        sendCoolMsg(msg, 'umm idk');

    }
  }

  // normal command matching
  if(msg.content.slice(0, prefix.length) === prefix){
    var content = msg.content.substring(prefix.length);
    var channel = msg.channel;
    var args = content.split(' ');
    var cmd = args[0];

    switch (cmd){
      case 'help':
        msg.reply('haha fucking loser');
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
      case 'skribbl':
        msg.reply(getSkribbl(args[1]));
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

// web server to send requests and make heroku happy
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

serv.listen(process.env.PORT || 5000);



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

// shipping function ;-)
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

var msgCache = [];
// send self-destructing message
function sendCoolMsg(origin, str){
  var channel = origin.channel;
  channel.send(str).then((msg) => {
    setTimeout(() => {
      channel.messages.delete(origin);
      channel.messages.delete(msg);
    }, 1000);
  });
}

var wordList = 'vision,crisp,gallop,acre,tutor,random,lyrics,clue,wig,sushi,dent,barber,bedbug,beggar,ceiling,cliff,coach,commercial,crust,diagonal,explore,fog,giant,internet,invitation,jazz,joke,landscape,level,lie,logo,mascot,mime,myth,organize,pharmacist,puppet,regret,revenge,rubber,safe,season,shrink,spine,teenager,think,year,week,zoo,skip,homework,peace,panic,far,parent,sleepover,sunscreen,detention,scare,hibernation,ivy,applause,bet,download,software,hardware,pose,text,scratch,spit,unite,multiply,divide,buy,flat,business,cruise,cuff,deep,wax,tusk,monster,bra,sing,ornament,toy,greeting,family,light,swear,hex,blink,voice,curse,shadow,swarm,feel,tease,sticker,case,tab,leave,sting,organ,drink,catch,fleet,bronze,game,future,home,fill,appendix,flea,tasty,dial,shape,crisis,harmonica,equality,drone,thong,rock,counter,sesame,voltage,syrup,blend,laundry,hype,kilogram,ounce,coaster,statistic,legal,illegal,law,radiation,air,design,biology,physics,friend,rude,ugly,sidekick,defend,forever,attic,band,fiber,flex,delete,nice,bad,lavender,oil,joint,beam,stock,vibes,classic,antique,escape,karaoke,spelling,creep,secret';
function getSkribbl(amount){
  var n = parseInt(amount);
  if(n > 0){
    var res = '';
    var list = wordList.split(',');
    for(var i = 0; i < n; i++){
      res += list[Math.floor(Math.random()*list.length)];
      if(i != n-1) res += ', ';
    }
    return res;
  } else {
    return wordList;
  }
}
