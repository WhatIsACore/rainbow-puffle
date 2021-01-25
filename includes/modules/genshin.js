'use strict';
// pull genshin data from hoyolabs website

const logger = require('../logger');
const axios = require('axios');

const profileURL = 'https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard';
const dataURL = 'https://bbs-api-os.hoyolab.com/game_record/genshin/api/index';
const headers = {
  'cookie': 'ltuid=70789477; ltoken=rXiY31VhXONVFxi2eAESXHli3k6346bnxfSu0dhX',
  'ds': '1611561823,MnAtDe,89006a2b30832c37da138eacc1b66658',
  'x-rpc-app_version': '1.5.0',
  'x-rpc-client_type': '4',
  'x-rpc-language': 'en-us'
};

// pull a player's profile using their *forum* ID
async function pullPlayerProfile(id) {
  const res = await axios.get(profileURL, {
    params: { uid: id },
    headers: headers
  }).catch(e => logger.error(e));

  return res && res.data.data ? res.data.data.list[0] : null;
}

// pull detailed game data using their *game* ID
async function pullPlayerData(id) {
  const res = await axios.get(dataURL, {
    params: {
      server: 'os_usa',
      role_id: id
    },
    headers: headers
  }).catch(e => logger.error(e));

  return res ? res.data.data : null;
}

var PlayerInfo = function (profile) {
  this.id = profile.game_role_id;
  this.name = profile.nickname;
  this.adventure_rank = parseInt(profile.level);
  this.days_active = parseInt(profile.data[0].value);
  this.characters_obtained = parseInt(profile.data[1].value);
  this.achievements_unlocked = parseInt(profile.data[2].value);
  this.spiral_abyss = profile.data[3].value;
}
PlayerInfo.prototype.addData = (data) => {
  this.characters = data.avatars;
  this.anemoculus = data.stats.anemoculus_number;
  this.geoculus = data.stats.geoculus_number;
  this.portrait_id = data.stats.avatar_number;
  this.waypoints = data.stats.way_point_number;
  this.domains = data.stats.domain_number;
  this.chests = {
    precious: data.stats.precious_chest_number,
    luxurious: data.stats.luxurious_chest_number,
    exquisite: data.stats.exquisite_chest_number,
    common: data.stats.common_chest_number
  };
  this.exploration = {};
  this.reputation = {};
  for (let i of data.world_explorations) {
    this.exploration[i.name] = i.exploration_percentage / 10;
    this.reputation[i.name] = i.level;
  }
}

async function getPlayer(id) {
  const profile = await pullPlayerProfile(id);
  if (!profile)
    return null;

  let player = new PlayerInfo(profile);

  const data = await pullPlayerData(player.id);
  if (!data)
    return null;

  player.addData(data);

  return player;
}

async function test() {
  let p = await getPlayer('70789477');
  logger.info(p.name);
}

test();
