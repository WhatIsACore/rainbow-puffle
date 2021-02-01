'use strict';

const logger = require('./logger');

const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
client.on('error', err => logger.error('ERR:REDIS:', err));
module.exports.client = client;

// turn redis commands into promises
const {promisify} = require('util');
const commands = ['get', 'set', 'del', 'hget', 'hset', 'hdel', 'hgetall', 'hmset', 'incr', 'incrby', 'hincrby'];
for (let c of commands)
  module.exports[c] = promisify(client[c].bind(client));
