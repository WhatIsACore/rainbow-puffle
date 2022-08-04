'use strict';

const logger = require('../logger');
const puppeteer = require('puppeteer-extra');
const client = require('../discordClient');
const ID = require('../idList');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const url = 'https://www.ticketmaster.com/event/Z7r9jZ1Ad4vr8?tmrid=TMR-3541790';

module.exports = msg => {
  if (!msg.cmd) return;
  if (msg.cmd === 'check') {
    msg.resolve();
    checkPrice(msg);
    return;
  }
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
  await initPuppeteer();
  setInterval(autoFetch, 60 * 60 * 1000);
}
init();

async function fetch() {
  await initPuppeteer();

  const page = await pup.newPage();
  await page.setViewport({width: 1920, height: 926});
  await page.goto(url);

  // make sure the data is already loaded before we start querying
  let tries = 0;
  await new Promise(async (resolve, reject) => {
    let int = setInterval(async () => {
      const loaded = await page.$('.quick-picks__button').catch(e => {});
      if (tries === 19) {
        const bodyText = await page.$eval('body', el => el.textContent);
        logger.info(bodyText);
      }
      if (loaded || tries > 20) {
        clearInterval(int);
        resolve();
      } else {
        tries++;
      }
    }, 500);
  });

  if (tries > 20) return;  // give up after 10 seconds

  let price = await page.evaluate(async () => {
    let t = document.querySelector('.quick-picks__button').innerText;
    return +t.substring(1, t.length - 3);
  });

  // free memory
  await page.goto('about:blank');
  page.close();

  return price;
}

async function autoFetch() {
  if (new Date().getHours() % 2 === 0)
    checkPrice();
}

async function checkPrice(msg) {
  let channel = msg ? msg.channel : client.channels.cache.get(ID.s_Personal);

  let loadMessage = await channel.send('fetching...');
  const price = await fetch();

  if (!price) {
    loadMessage.edit('i failed rawr');
    return;
  }

  if (price < 50) channel.send('@everyone');

  loadMessage.edit('bea\'s tix is $' + price.toFixed(2));
}
