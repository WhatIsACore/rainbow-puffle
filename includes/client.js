'use strict';

const logger = require('./logger');
const ID = require('./idList');

const client = require('./discordClient')

module.exports.start = () => {
  client.login(process.env.DISCORD_TOKEN);
}

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Club Penguin');
});

const modules = [
  require('./modules/reply'),
  require('./modules/backdoor'),
  require('./modules/interesting'),
  //require('./modules/groovy'),
  //require('./modules/pokemonLs'),
  require('./modules/pogchamp'),
  //require('./modules/genshin'),
  //require('./modules/ticketmaster')
];

client.on('message', msg => {

  if (msg.author.id == ID.RainbowPuffle) return;

  // recognize commands
  if (msg.content.slice(0, process.env.PREFIX.length) === process.env.PREFIX) {
    const content = msg.content.substring(process.env.PREFIX.length);
    msg.cArgs = content.split(' ');
    msg.cmd = msg.cArgs[0];
    msg.unresolved = true;
    msg.resolve = resolveMsg;
  }

  msg.lowercase = msg.content.toLowerCase();

  // run the message through each module
  for (let m of modules)
    m(msg);

  if (msg.unresolved)
    msg.reply('idk what that means');

});

// mark a command as being resolved
function resolveMsg(response) {
  if (response)
    this.reply(response);
  this.cmd = null;
  this.unresolved = false;
}
