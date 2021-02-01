'use strict';

const logger = require('../../logger');
const db = require('../../redisClient');

const scraper = require('./scraper');
const embeds = require('./embeds');

const linkPlayer = require('./linkPlayer');
const sendCharacterOwners = require('./sendCharacterOwners');
const sendLeaderboard = require('./sendLeaderboard');

scraper.init();

module.exports = msg => {

  if (!msg.cmd) return;

  if (msg.cmd === 'link') {
    if (msg.cArgs.length < 2) {
      msg.resolve(`link your game:\n**1.** sign in to https://www.hoyolab.com/genshin/accountCenter/gameRecord\n**2.** set your chronicle to public\n**3.** copy your forum user ID from the website (not the one in game)\n**4.** !link <paste-id-here>`);
      return;
    }
    msg.resolve();
    linkPlayer(msg);
    return;
  }

  if (msg.cmd === 'profile' || msg.cmd === 'pr') {
    msg.resolve();
    sendPlayerInfo(msg);
    return;
  }
  if (msg.cmd === 'characters' || msg.cmd === 'chars') {
    msg.resolve();
    sendPlayerInfo(msg, 'characters');
    return;
  }
  if (msg.cmd === 'exploration') {
    msg.resolve();
    sendPlayerInfo(msg, 'exploration');
    return;
  }

  if (msg.cmd === 'whohas') {
    if (msg.cArgs.length < 2) {
      msg.resolve(`uh oh`);
      return;
    }
    msg.resolve();
    sendCharacterOwners(msg);
    return;
  }

  if (msg.cmd === 'adventurerank' || msg.cmd === 'ar') {
    msg.resolve();
    sendLeaderboard(msg, 'adventure_rank', 'adventure rank', p => {
      return `**${p[2]}: ${p[0]}** - AR ${p[1]}`;
    });
    return;
  }

  if (msg.cmd === 'daysactive' || msg.cmd === 'active') {
    msg.resolve();
    sendLeaderboard(msg, 'days_active', 'days active', p => {
      return `**${p[2]}: ${p[0]}** - ${p[1]} days`;
    });
    return;
  }

  if (msg.cmd === 'achievements') {
    msg.resolve();
    sendLeaderboard(msg, 'achievements', 'achievements', p => {
      return `**${p[2]}: ${p[0]}** - ${p[1]}`;
    });
    return;
  }

  if (msg.cmd === 'anemoculi') {
    msg.resolve();
    sendLeaderboard(msg, 'anemoculi', 'anemoculi', p => {
      return `**${p[2]}: ${p[0]}** - ${p[1]}`;
    });
    return;
  }

  if (msg.cmd === 'geoculi') {
    msg.resolve();
    sendLeaderboard(msg, 'geoculi', 'geoculi', p => {
      return `**${p[2]}: ${p[0]}** - ${p[1]}`;
    });
    return;
  }

  if (msg.cmd === 'charactersunlocked') {
    msg.resolve();
    sendLeaderboard(msg, 'characters_unlocked', 'characters unlocked', p => {
      return `**${p[2]}: ${p[0]}** - ${p[1]}`;
    });
    return;
  }

  if (msg.cmd === 'spiral_abyss' || msg.cmd === 'abyss') {
    msg.resolve();
    sendLeaderboard(msg, 'spiral_abyss', 'spiral abyss', p => {
      return `**${p[2]}: ${p[0]}** - Floor ${p[1]}`;
    });
    return;
  }

  if (msg.cmd === 'chests' || msg.cmd === 'chestsopened') {
    msg.resolve();
    sendLeaderboard(msg, 'chests_opened', 'chests opened', p => {
      return `**${p[2]}: ${p[0]}** - ${p[1]}`;
    });
    return;
  }

  if (msg.cmd === 'monstadt') {
    msg.resolve();
    sendLeaderboard(msg, 'exploration_monstadt', 'monstadt exploration', p => {
      return `**${p[2]}: ${p[0]}** - ${p[1]}%`;
    });
    return;
  }

  if (msg.cmd === 'liyue') {
    msg.resolve();
    sendLeaderboard(msg, 'exploration_liyue', 'liyue exploration', p => {
      return `**${p[2]}: ${p[0]}** - ${p[1]}%`;
    });
    return;
  }

  if (msg.cmd === 'dragonspine') {
    msg.resolve();
    sendLeaderboard(msg, 'exploration_dragonspine', 'dragonspine exploration', p => {
      return `${p[2]}: **${p[0]}** - ${p[1]}%`;
    });
    return;
  }

}

async function sendPlayerInfo(msg, type) {
  const loadMessage = await msg.channel.send('fetching...');
  let user = msg.mentions.users.first();
  if (!user) user = msg.author;

  let hoyoID = await db.hget('_links-' + msg.guild.id, user.id);
  if (!hoyoID) {
    loadMessage.edit('user hasn\'t !link-ed their account');
    return;
  }

  const playerInfo = await scraper.fetch(hoyoID);
  if (!playerInfo) {
    loadMessage.edit('failed. Maybe their chronicle isn\'t public?');
    return;
  }

  loadMessage.edit('', embeds.createPlayerInfoEmbed(playerInfo, type));
}
