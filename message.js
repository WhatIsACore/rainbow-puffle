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
    case 'skribl':
      msg.reply(getSkribl(args[1]));
      break;
    case 'tanratz':
      msg.reply(getTanRatz(args[1]));
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
function getSkribl(amount){
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


// tanratzmatz word
var tanratz = 'malia,abby,max,tan,zeki,ragu,stephen,gary may,elon musk,donald trump,hilary clinton,barack obama,joe biden,mike pence,kamala harris,bernie sanders,joe rogan,ben shapiro,pokimane,pewdiepie,belle delphine,cardi b,baekhyun,eminem,taylor swift,leonardo dicaprio,kanye west,victoria justice,megan thee stallion,nicki minaj,macklemore,joji,coronavirus,china,japan,korea,vietnam,phillipines,india,united states,hong kong,skribl,covidopoly,secret hitler,spyfall,one night werewolf,protobowl,mahjong,chess,minesweeper,kahoot,dungeons & dragons,paranoia,mudae,groovy,rainbow puffle,minecraft,roblox,fortnite,club penguin,osu,pokemon,love live,discord,netflix,spotify,zoom,tik tok,wildfire,youtube,instagram,facebook,snapchat,messenger,linkedin,photoshop,procreate,canvas,fremont,pleasanton,gardena,davis,woodland,sacramento,vacaville,san francisco,los angeles,uc davis,uc berkeley,uc riverside,design,english,biology,cognitive science,statistics,philosophy,computer science,stem,monster,psycho,candy,triple baka,umbrella academy,brand new animal,hunter x hunter,bunny girl senpai,gintama,new girl,avatar,hamilton,spiderman,knives out,jojo,waifu,husbando,divorce,donkey kong,exo,superm,bts,red velvet,christianity,buddhism,jesus christ,affirmative action,black lives matter,maga,communism,anime,kpop,idol,yn moment,kakera,simp,karen,chad,owo,uwu,ok boomer,kermit the frog,shrek,thanos,kurapika,pepe,pogchamp,picnic day,sunset fest,dormal,segundo,tercero,cuarto,latitude,memorial union,shields library,arboretum,death star,water tower,arc,aggie,cow,egghead,bicycle,rite aid,old teahouse,itea,starbucks,trader joes,am pm,burgers and brew,woodstock\'s pizza,mongolian wok,miller,sequoia,yosemite,machete man,tornado,tanratzmatz,taekwondo,all star,ram ranch,feet';
function getTanRatz(amount){
  var n = parseInt(amount);
  if(n > 0){
    var res = '';
    var list = tanratz.split(',');
    for(var i = 0; i < n; i++){
      res += list[Math.floor(Math.random()*list.length)];
      if(i != n-1) res += ', ';
    }
    return res;
  } else {
    return wordList;
  }
}
