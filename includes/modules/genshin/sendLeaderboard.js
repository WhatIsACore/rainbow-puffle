'use strict';

const logger = require('../../logger');
const db = require('../../redisClient');
const scraper = require('./scraper');
const embeds = require('./embeds');
const characterList = require('./characterList');

async function sendLeaderboard(msg, stat, title, displayMethod) {
  let loadMessage = await msg.channel.send('fetching...');

  let players = {};

  // get everyone who has the character in the server
  const linkedUsers = await db.hgetall('_links-' + msg.guild.id);
  let promArr = [];
  for (let id in linkedUsers)
    promArr.push(new Promise(async (resolve, reject) => {
      const playerInfo = await scraper.fetch(linkedUsers[id]);
      if (!playerInfo) {
        resolve();
        return;
      }
      // pullt the specific stat
      const member = await msg.guild.members.fetch(id);
      if (playerInfo[stat])
        players[member.user.tag] = playerInfo[stat];
      resolve();
    }));
  await Promise.all(promArr);

  // sort the list
  let playerList = Object.keys(players);
  if (stat === 'spiral_abyss') {
    playerList.sort((a, b) => {
      let a_split = a.split('-');
      let b_split = b.split('-');
      let a_score = Number(a_split[0]) * 3 + Number(a_split[1]);
      let b_score = Number(a_split[0]) * 3 + Number(a_split[1]);
      return b_score - a_score;
    });
  } else {
    playerList.sort((a, b) => {
      return players[b] - players[a];
    });
  }

  playerList = playerList.map(p => {
    return [p, players[p]];
  });

  // add rankings
  playerList[0].push(1);
  for (let i = 1; i < playerList.length; i++) {
    playerList[i].push(playerList[i][1] == playerList[i-1][1] ? playerList[i-1][2] : i+1);
  }

  logger.info(playerList);

  playerList = playerList.map(displayMethod);

  const embed = embeds.createListEmbed(title, playerList, 10);
  loadMessage.edit('', embed);
}
module.exports = sendLeaderboard;
