'use strict';
// fine, i guess you are my little pogchamp

module.exports = msg => {

  if (msg.cmd === 'pogchamp'){
    msg.channel.send({
      files: ['./files/childe.mp4']
    });
    msg.resolve();
  }

  if (msg.lowercase == 'fine, i guess you are my little pogchamp')
    msg.channel.send({
      files: ['./files/childe.mp4']
    });

}
