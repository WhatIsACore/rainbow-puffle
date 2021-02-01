'use strict';

const logger = require('../../logger');
const db = require('../../redisClient');
const scraper = require('./scraper');

async function linkPlayer(msg) {
  let loadMessage = await msg.channel.send('linking...');

  const discordID = msg.author.id;
  const hoyoID = msg.cArgs[1];
  const playerInfo = await scraper.fetch(hoyoID);

  if (!playerInfo) {
    loadMessage.edit('failed. Make sure your chronicle is public and you use the correct forum ID (not the one in game)');
    return;
  }

  db.hset('_links-' + msg.guild.id, msg.author.id, hoyoID);
  loadMessage.edit(`linked ${playerInfo.name} to ID: ${hoyoID}!`);
}
module.exports = linkPlayer;
