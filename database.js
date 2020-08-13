'use strict';

const Discord = require('discord.js');

var config;
try {
  config = require('./config');
} catch(e){
  config = process.env;
}

// manage the database (to store Ls)

let redis = require('redis');
let client = redis.createClient(config.REDIS_URL);

client.on('connect', () => {
  console.log('connected to redis!');
});

// add an L to a user.
function addL(user, channel){
  client.hmget('scoreboard', user.tag, (err, reply) => {
    var res = reply[0] == null ? 1 : Number(reply[0]) + 1; // user may not be in the database yet.
    if(res == 1){
      client.hmset('scoreboard', user.tag, '1');
      channel.send(user.username + ' took their first L. total: 1');
    } else {
      client.hmset('scoreboard', user.tag, res.toString());
      channel.send(user.username + ' took another L. total: ' + res);
    }
  });
}
module.exports.addL = addL;

function giveL(msg, amount){
  var target = msg.mentions.users.first();
  if(target == null){
    msg.reply('you have to say who to give it to');
    return;
  }

  if(Number(amount) == NaN) amount = 1;

  // check if the giver has ability to give an L
  client.hmget('scoreboard', target.tag, (err, reply) => {
    var res = reply[0] == null ? 1 : Number(reply[0]) + amount;
    client.hmset('scoreboard', target.tag, res.toString());
    msg.channel.send(`gave ${target.username} ${amount} ${amount == 1 ? 'L' : 'Ls'}. total: ${res}`);
  });
}
module.exports.giveL = giveL;

// return how many Ls a user currently has
function score(msg){
  var user = msg.mentions.users.first();
  if(user == null) user = msg.author;
  client.hmget('scoreboard', user.tag, (err, reply) => {
    var res = reply[0] == null ? 0 : reply[0];
    msg.reply(
      (user == msg.author ? 'you have' : user.username + ' has')
       + ' taken ' + res + (res === 1 ? ' L' : ' Ls') + '.'
    );
  });
}
module.exports.score = score;

function leaderboard(msg){
  client.hgetall('scoreboard', (err, reply) => {
    var leaderboard = Object.keys(reply).map(key => {
      return [key, reply[key]];
    }).sort((a, b) => {
      return b[1] - a[1];
    });
    var res = '```';
    for(var i of leaderboard)
      res += i[1] + ' - ' + i[0].split('#')[0] + '\n';
    res += '```';
    msg.reply(res);
  });
}
module.exports.leaderboard = leaderboard;
