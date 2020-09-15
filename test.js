var people = 'Malia,Allison,Abby,Max,Tan,Zeki,Ragu,Stephen,Bryan Enderle,Gary May,Elon Musk,Vinny Pacheco,Jeff Bezos,Mark Zuckerburg,Donald Trump,Hilary Clinton,Barack Obama,Joe Biden,Mike Pence,Kamala Harris,Bernie Sanders,Joe Rogan,Ben Shapiro,Pokimane,Pewdiepie,Belle Delphine,Cardi B,Baekhyun,Eminem,Taylor Swift,Leonardo DiCaprio,Kanye West,Megan Thee Stallion,Nicki Minaj,Beabadoobee,Ariana Grande,Macklemore,Joji,Hitler,Mudae,Groovy,Rainbow Puffle,Donkey Kong,Jesus Christ,Buddha,Alexander Hamilton,Kermit the Frog,Shrek,Spongebob,Patrick,Thanos,Kurapika,Pepe,Machete Man';

var list = people.split(',');
var rseed = require('random-seed');
var d = new Date();
var seed = d.getMonth() + d.getDate() + d.getFullYear() + 'HEDO';
var generator = rseed.create(seed);
people = people.split(",");
var res = people[generator.intBetween(0, people.length - 1)];
console.log(res);
