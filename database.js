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

function addL(msg){
  var tag = msg.mentions.users.first().tag;
  client.hmget('scoreboard', tag, (err, reply) => {
    var res = reply[0] == null ? 1 : Number(reply[0]) + 1;
    if(res == 1){
      client.hmset('scoreboard', tag, '1');
      msg.channel.send('<' + tag + '> took their first L. total: 1');
    } else {
      res = Number(res);
      client.hmset('scoreboard', tag, res.toString());
      msg.channel.send('<' + tag + '> took another L. total: ' + res);
    }
  });
}
module.exports.addL = addL;

function countL(msg){
  var tag = msg.mentions.users.first().tag;
  client.hmget('scoreboard', tag, (err, reply) => {
    var res = reply[0] == null ? 0 : reply[0];
    msg.reply(tag + ' has taken ' + res + (res === 1 ? ' L' : ' Ls') + '.');
  });
}
module.exports.countL = countL;

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
