'use strict';
// some very basic commands

module.exports = msg => {

  if (!msg.cmd) return;

  if (msg.cmd === 'help')
    msg.resolve('haha loser');

  if (msg.cmd === 'ping')
    msg.resolve('pong');

  if (msg.cmd === 'isclubpenguinback')
    msg.resolve('no ;(');

  if (msg.cmd === 'fujimoto'){
    msg.channel.send({
      files: ['https://i.imgur.com/VO6x4ch.png']
    });
    msg.resolve();
  }

}
