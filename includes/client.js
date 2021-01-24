'use strict';

const logger = require('./logger');
const ID = require('./idList');

const Discord = require('discord.js');
const client = new Discord.Client();

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
  require('./modules/groovy'),
  require('./modules/pokemonLs'),
  require('./modules/pogchamp'),
  require('./modules/skribbl')
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

// kick stephen if he ever tries to join the genshin impact server
client.on('guildMemberAdd', member => {
  if (member.id == ID.Stephen && member.guild.id == ID.s_Genshin)
    member.kick('no');
});

// mark a command as being resolved
function resolveMsg(response) {
  if (response)
    this.reply(response);
  this.cmd = null;
  this.unresolved = false;
}
