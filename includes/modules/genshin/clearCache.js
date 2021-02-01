'use strict';
// run this from the command line.

const logger = require('../../logger');
const db = require('../../redisClient');

db.del('player-cache');
