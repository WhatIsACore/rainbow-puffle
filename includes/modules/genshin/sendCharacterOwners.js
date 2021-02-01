'use strict';

const logger = require('../../logger');
const db = require('../../redisClient');
const scraper = require('./scraper');
const embeds = require('./embeds');
const characterList = require('./characterList');

async function sendCharacterOwners(msg) {
  let loadMessage = await msg.channel.send('fetching...');

  let character = characterList.get(msg.cArgs[1]);
  if (!character) {
    loadMessage.edit('couldn\'t recognize that character.');
    return;
  }

  let owners = {};

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
      const member = await msg.guild.members.fetch(id);
      if (playerInfo.characters[character])
        owners[member.user.tag] = playerInfo.characters[character];
      resolve();
    }));
  await Promise.all(promArr);

  // sort the list by levels
  let ownerList = Object.keys(owners);
  ownerList.sort((a, b) => {
    return owners[b] - owners[a];
  });

  ownerList = ownerList.map(o => {
    return `**${o}** - lv.${owners[o]}`;
  });

  const embed = embeds.createListEmbed(`${ownerList.length} / ${Object.keys(linkedUsers).length} players on this server own **${character.toUpperCase()}**.`, ownerList, 10);
  loadMessage.edit('', embed);
}
module.exports = sendCharacterOwners;
