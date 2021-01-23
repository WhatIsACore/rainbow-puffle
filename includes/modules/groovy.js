'use strict';
// complain when Groovy plays kpop

const ID = require('../idList');

module.exports = msg => {

  if (msg.author.id != ID.Groovy) return;

  // break down the message body
  const content = JSON.stringify(msg, circ);
  cache = [];

  if (content.match(korean_charset) != null) msg.channel.send('ew kpop ;(');
  if (content.match(japanese_charset) != null) msg.channel.send('uwu jpop :>');

}

// regex charset matches
const korean_charset = /[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]/ugi;
const japanese_charset = /[\u3000-\u303f\u3040-\u309f]/ugi;

let cache = [];
function circ(key, value){
  if (typeof value === 'object' && value !== null) {
    if (cache.indexOf(value) !== -1) return;
    cache.push(value);
  }
  return value;
}
