'use strict';

const logger = require('../../logger');

const puppeteer = require('puppeteer');

const url = 'https://webstatic-sea.hoyolab.com/app/community-game-records-sea/index.html?uid=';
const cookies = [
  {
    'name': 'ltuid',
    'value': '109149200',
    'domain': '.hoyolab.com'
  },
  {
    'name': 'ltoken',
    'value': 'vlZfVCP6SpylvlsJvhDqPXRh9oweXxQHEHCXqtA5',
    'domain': '.hoyolab.com'
  }
];

let pup;
async function initPuppeteer() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 926});
  await page.setCookie(...cookies);

  logger.info('puppeteer launched!');
  return page;
}

async function getPlayer(id) {
  if(!pup)
    pup = await initPuppeteer();

  await pup.goto(url + id + '#/ys?t=' + Date.now());

  // make sure the player card is loaded first
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 10000);
  });

  const name = await pup.$eval('.title', el => el.innerHTML);

  logger.info(name);
}
getPlayer(70789477);
