'use strict';
// make fun of stephen for saying interesting

const ID = require('../idList');

module.exports = msg => {
  // as a command
  if (msg.cmd === 'interesting') {
    msg.channel.send({
      files: ['https://i.imgur.com/ekiVU6G.jpg']
    });
    msg.resolve();
  }

  // as a message
  if (msg.lowercase == 'interesting')
    msg.channel.send({
      files: [msg.author.id == ID.Stephen ? 'https://i.imgur.com/ekiVU6G.jpg' : 'https://i.imgur.com/VZfswTP.jpg']
    });

  if (msg.lowercase == 'inch resting')
    msg.channel.send({
      files: ['https://i.imgur.com/hNfmUVt.jpg']
    });

}
