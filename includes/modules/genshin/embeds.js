'use strict'

const Discord = require('discord.js');
const logger = require('../../logger');

// creates sendable embeds

function toWorldLevel(AR) {
  if (AR < 20) return 0;
  if (AR < 25) return 1;
  if (AR < 30) return 2;
  if (AR < 35) return 3;
  if (AR < 40) return 4;
  if (AR < 45) return 5;
  if (AR < 50) return 6;
  if (AR < 55) return 7;
  return 8;
}

module.exports.createPlayerInfoEmbed = (playerInfo, type) => {
  const embed = new Discord.MessageEmbed()
    .setColor('#22CA20')
    .setTitle(playerInfo.name);

  let content = '';

  switch (type) {

    case 'characters':
      embed.setDescription(`${playerInfo.characters_unlocked} / 28 characters unlocked`);
      let characters = Object.keys(playerInfo.characters);
      characters.sort((a, b) => {
        return playerInfo.characters[b] - playerInfo.characters[a];
      });
      for (let c of characters)
        content += `**${c}** lv.${playerInfo.characters[c]}\n`;
      break;

    case 'exploration':
      embed.setDescription(`${playerInfo.chests_opened} chests opened\n`);
      content += `**Monstadt:** ${playerInfo.exploration_monstadt.toFixed(1)}%\n`;
      content += `**Liyue:** ${playerInfo.exploration_liyue.toFixed(1)}%\n`;
      content += `**Dragonspine:** ${playerInfo.exploration_dragonspine.toFixed(1)}%\n`;
      break;

    default:
      embed.setDescription(`AR ${playerInfo.adventure_rank} / World Level ${toWorldLevel(playerInfo.adventure_rank)}`);
      content += `**Days Active:** ${playerInfo.days_active} days\n`;
      content += `**Achievements:** ${playerInfo.achievements}\n`;
      content += `**Characters:** ${playerInfo.characters_unlocked}\n`;
      content += `**Spiral Abyss:** Floor ${playerInfo.spiral_abyss}\n`;
      embed.setFooter('!characters, !exploration');

  }

  embed.addField(`—`, content);
  return embed;
};

module.exports.createListEmbed = (description, list, limit) => {
  const embed = new Discord.MessageEmbed()
    .setColor('#FFFF1C')
    .setDescription(description);

  let content = '';

  if (list.length === 0)
    content = `*no results*`;

  if (list.length < limit) limit = list.length;
  for (let i = 0; i < limit; i++) {
    content += list[i] + '\n';
  }

  embed.addField(`—`, content);
  if (list.length > limit)
    embed.setFooter(`...and ${list.length - limit} more`);

  return embed;
}
