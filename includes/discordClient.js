'use strict';

const Discord = require('discord.js');
const allIntents = new Discord.Intents(32767);
const client = new Discord.Client({ allIntents });
module.exports = client;
