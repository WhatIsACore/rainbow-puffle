'use strict';

// channel ids:
// 447974253288095745: bot testing grounds
// 697310659695607810: tanratz

// process normal commands

var prefix = '!';
module.exports.prefix = prefix;

let database = require('./database');

function process(msg, content){
  var channel = msg.channel;
  var args = content.split(' ');
  var cmd = args[0];

  switch (cmd){
    case 'help':
      msg.reply('haha fucking loser');
      break;
    case 'ping':
      msg.reply('pong');
      break;
    case 'isclubpenguinback':
      msg.reply('no ;(');
      break;
    case 'skribbl':
      msg.reply(getSkribbl(args[1]));
      break;
    case 'leaderboard':
      database.leaderboard(msg);
      break;
    case 'score':
      database.score(msg);
      break;
    //case 'L':
      //database.giveL(msg);
      //break;
    default:
      msg.reply('idk what that means, try ' + prefix + 'help');
  }
}
module.exports.process = process;

// dictionary word generator
var wordList = 'vision,crisp,gallop,acre,tutor,random,lyrics,clue,wig,sushi,dent,barber,bedbug,beggar,ceiling,cliff,coach,commercial,crust,diagonal,explore,fog,giant,internet,invitation,jazz,joke,landscape,level,lie,logo,mascot,mime,myth,organize,pharmacist,puppet,regret,revenge,rubber,safe,season,shrink,spine,teenager,think,year,week,zoo,skip,homework,peace,panic,far,parent,sleepover,sunscreen,detention,scare,hibernation,ivy,applause,bet,download,software,hardware,pose,text,scratch,spit,unite,multiply,divide,buy,flat,business,cruise,cuff,deep,wax,tusk,monster,bra,sing,ornament,toy,greeting,family,light,swear,hex,blink,voice,curse,shadow,swarm,feel,tease,sticker,case,tab,leave,sting,organ,drink,catch,fleet,bronze,game,future,home,fill,appendix,flea,tasty,dial,shape,crisis,harmonica,equality,drone,thong,rock,counter,sesame,voltage,syrup,blend,laundry,hype,kilogram,ounce,coaster,statistic,legal,illegal,law,radiation,air,design,biology,physics,friend,rude,ugly,sidekick,defend,forever,attic,band,fiber,flex,delete,nice,bad,lavender,oil,joint,beam,stock,vibes,classic,antique,escape,karaoke,spelling,creep,secret,sister,uncle,purr,hiccup,blind,creak,settler,frame,glass,class,abuse,ruins,dimension,vent,pain,silk,draft,new,lose,tight,flip,behind,orgasm,embryo,bravery';
function getSkribbl(amount){
  var n = parseInt(amount);
  if(n > 0){
    var res = '';
    var list = wordList.split(',');
    for(var i = 0; i < n; i++){
      res += list[Math.floor(Math.random()*list.length)];
      if(i != n-1) res += ', ';
    }
    return res;
  } else {
    return wordList;
  }
}
