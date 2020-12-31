// toxicity check
'use strict';

require('@tensorflow/tfjs-node');
const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.9;
let model;

async function analyze(msg){

  var inputs = [];
  inputs.push(msg.content);

  if(!model)
    model = await toxicity.load();

  const results = await model.classify(inputs);
  var res = '```\n';

  var toxicReacts = ['👎', '❌', '🙅‍♂️', '🙅‍♀️', '⚠️'];

  results.forEach((i) => {
    if(i.results[0].match != false){
      if(i.label == 'toxicity') msg.react(toxicReacts[Math.floor(Math.random() * toxicReacts.length)]);
      if(i.label == 'severe_toxicity') msg.react('😱');
      if(i.label == 'sexual_explicit') msg.react('🤮');
    }
  });
}
module.exports.analyze = analyze;
