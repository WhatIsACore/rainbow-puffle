'use strict';

function getCharacter(name) {
  name = name.toLowerCase();
  if (aliases[name])
    name = aliases[name];
  name = name[0].toUpperCase() + name.slice(1);
  if (list.indexOf(name) > -1) return name;
  return;
}
module.exports.get = getCharacter;

const list = [
  'Albedo',
  'Amber',
  'Barbara',
  'Beidou',
  'Bennett',
  'Chongyun',
  'Diluc',
  'Diona',
  'Fischl',
  'Ganyu',
  'Hu tao',
  'Kaeya',
  'Keqing',
  'Klee',
  'Lisa',
  'Mona',
  'Ningguang',
  'Noelle',
  'Traveller',
  'Jean',
  'Qiqi',
  'Razor',
  'Rosaria',
  'Sucrose',
  'Tartaglia',
  'Venti',
  'Xiangling',
  'Xiao',
  'Xingqiu',
  'Xinyan',
  'Zhongli'
];
module.exports.list = list;

const aliases = {
  childe: 'tartaglia',
  aether: 'traveller',
  lumine: 'traveller',
  cocogoat: 'ganyu',
  hutao: 'hu tao'
};
module.exports.aliases = aliases;
