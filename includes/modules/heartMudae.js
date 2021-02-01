'use strict';
// heart reacts mudae

const ID = require('../idList');

module.exports = msg => {

  if (msg.author.id != ID.Mudae) return;

  if(JSON.stringify(msg, circ).indexOf('REACT with') != -1)
    msg.react('❤️');

  cache = [];

}

var cache = [];
function circ(key, value){
  if(typeof value === 'object' && value !== null) {
    if(cache.indexOf(value) !== -1) return;
    cache.push(value);
  }
  return value;
}
