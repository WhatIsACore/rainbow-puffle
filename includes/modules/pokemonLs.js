'use strict';
// track Ls on mudae pokemon gacha

const ID = require('../idList');
const db = require('../redisClient');

module.exports = msg => {
  if (msg.cmd === 'score') {
    msg.resolve();
    showScore(msg);
  }
  if (msg.cmd === 'leaderboard') {
    msg.resolve();
    showLeaderboard(msg);
  }

  if (msg.author.id != ID.Mudae) return;

  if (msg.content.indexOf('Congratulations, you won an uncommon nothing.') != -1) {
    // find the loser
    let loser;
    if (msg.mentions.users.first() != null) {
      loser = msg.mentions.users.first();
    } else {
      let nickname = msg.content.split('\n').pop().split(' ')[0].slice(0, -1);
      loser = msg.channel.members.filter((member) => {
        return member.user.username == nickname;
      }).first().user;
    }
    // give them an L
    const score = db.hincr('scoreboard', loser.tag, 1).then(() => {
      msg.channel.send(
        loser.username + (score == 1 ? ' took their first L. total: 1' : ` took another L. total: ${score}`)
      );
    });
  }

}


async function showScore(msg){
  var user = msg.mentions.users.first();
  if(user == null) user = msg.author;

  const reply = await db.hmget('scoreboard', user.tag);
  const score = reply[0] == null ? 0 : reply[0];
  msg.resolve(
    (user == msg.author ? 'you have' : user.username + ' has')
     + ' taken ' + score + (score === 1 ? ' L' : ' Ls') + '.'
  );
}

async function showLeaderboard(msg){
  const reply = await db.hgetall('scoreboard');
  if (!reply) {
    msg.resolve('no scores found');
    return;
  }

  const leaderboard = Object.keys(reply).map(key => {
    return [key, reply[key]];
  }).sort((a, b) => {
    return b[1] - a[1];
  });

  let res = '```';
  for(var i of leaderboard)
    res += i[1] + ' - ' + i[0].split('#')[0] + '\n';
  res += '```';
  msg.resolve(res);
}
