'use strict';
// use puppeteer to get a player's stats from the hoyolabs forums

const logger = require('../../logger');
const db = require('../../redisClient');
const puppeteer = require('puppeteer');

const url = 'https://webstatic-sea.hoyolab.com/app/community-game-records-sea/index.html?uid=';
const cookies = [  // to pass to puppeteer
  {
    'name': 'ltuid',
    'value': '110879284',
    'domain': '.hoyolab.com'
  },
  {
    'name': 'ltoken',
    'value': 'TZCntshtvGxav5tEmuVOReMZ30lZOjpul4pXupXP',
    'domain': '.hoyolab.com'
  }
];

// cache results in redis so we don't query puppeteer as much
let cache = {};
function CachedResult(data) {
  this.data = data;
  this.timestamp = Date.now();
}
function isExpired(cachedResult) {
  return Date.now() - cachedResult.timestamp > 60 * 60 * 1000  // 1 hour
}

// start the puppeteer browser
let pup;
async function initPuppeteer() {
  if (pup) return;

  pup = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  logger.info('puppeteer launched!');
  return;
}

async function init() {
  initPuppeteer();
  // restore cache from redis
  let res = await db.hgetall('player-cache');
  if (res)
    for (const i in res) {
      cache[i] = JSON.parse(res[i]);
    }

  setInterval(autoFetch, 5 * 60 * 1000);
}
module.exports.init = init;

// id is forum id
async function fetchPlayerInfo(id) {
  // prioritize returning a cached result
  if (cache[id] && !isExpired(cache[id])) {
    return cache[id].data;
  }

  await initPuppeteer();

  const page = await pup.newPage();
  await page.setViewport({width: 1920, height: 926});
  await page.setCookie(...cookies);
  await page.goto(url + id + '#/ys?t=' + Date.now());

  // make sure the data is already loaded before we start querying
  let tries = 0;
  await new Promise(async (resolve, reject) => {
    let int = setInterval(async () => {
      const statLoaded = await page.$('.summary-item-layout.item .value');
      const charLoaded = await page.$('.role-card-large');
      const explorationLoaded = await page.$('.exploration-card .info .text');
      if ((statLoaded && charLoaded && explorationLoaded) || tries > 20) {
        clearInterval(int);
        resolve();
      } else {
        tries++;
      }
    }, 500);
  });

  if (tries > 20) return;  // give up after 10 seconds

  let playerInfo = await page.evaluate(async () => {
    let res = {};
    res.name = document.querySelector('.header-layout .left .title').innerText;
    res.adventure_rank = Number(document.querySelector('.header-layout .left .info').innerText.slice(4));

    const stats = document.querySelectorAll('.summary-item-layout.item .value');
    res.days_active = Number(stats[0].innerText);
    res.achievements = Number(stats[1].innerText);
    res.anemoculi = Number(stats[2].innerText);
    res.geoculi = Number(stats[3].innerText);
    res.characters_unlocked = Number(stats[4].innerText);
    res.spiral_abyss = stats[7].innerText;

    const luxurious_chests = Number(stats[8].innerText);
    const precious_chests = Number(stats[9].innerText);
    const exquisite_chests = Number(stats[10].innerText);
    const common_chests = Number(stats[11].innerText);
    res.chests_opened = luxurious_chests + precious_chests + exquisite_chests + common_chests;

    // spelling mistakes are intentional (they must match mihoyo's file names)
    const characterList = ['Albedo','Ambor','Barbara','Beidou','Bennett','Chongyun','Diluc','Diona','Fischl','Ganyu','Kaeya','Keqing','Klee','Lisa','Mona','Ningguang','Noel','PlayerBoy','PlayerGirl','Qin','Qiqi','Razor','Sucrose','Tartaglia','Venti','Xiangling','Xiao','Xingqiu','Xinyan','Zhongli'];
    const corrections = {
      Ambor: 'Amber',
      Noel: 'Noelle',
      Qin: 'Jean',
      PlayerBoy: 'Traveller',
      PlayerGirl: 'Traveller'
    }

    res.characters = {};
    const roleCards = document.querySelectorAll('.role-card-large');
    for (roleCard of roleCards) {
      let matchedCharacter;
      for (char of characterList)
        if (roleCard.innerHTML.indexOf(char) > -1) {
          matchedCharacter = char;
          break;
        }
      if (corrections[matchedCharacter])
        matchedCharacter = corrections[matchedCharacter];
      res.characters[matchedCharacter] = Number(roleCard.children[1].innerHTML.slice(4)); // get level
    }

    const explorations = document.querySelectorAll('.exploration-card .info .text');
    res.exploration_dragonspine = parseFloat(explorations[0].innerText.slice(21));
    res.exploration_monstadt = parseFloat(explorations[1].innerText.slice(21));
    res.exploration_liyue = parseFloat(explorations[2].innerText.slice(21));

    return res;
  });

  // free memory
  await page.goto('about:blank');
  page.close();

  // cache results
  cache[id] = new CachedResult(playerInfo);
  db.hset('player-cache', id, JSON.stringify(new CachedResult(playerInfo)));
  return playerInfo;
}
module.exports.fetch = fetchPlayerInfo;

// automatically fetch some results now and then to limit load
async function autoFetch() {
  let target;
  for (let i in cache)
    if (isExpired(cache[i])) {
      target = i;
      break;
    }

  if (!target) return;
  fetchPlayerInfo(target);
}
