let n = Math.floor( Math.random()* 1000 );
let n2 = Math.floor( Math.random() * 10000);
let n3 = Math.floor( Math.random() * 100000 );
let n4 = Math.floor( Math.random() * 1000000 );
let n5 = Math.floor( Math.random() * 10**12 )

console.log(n)

if(message.author.bot) return;

let id = message.author.id;

if(id in luckydb == false){
  luckydb[id] = { points: 0, messages: [], tag: message.author.tag, messagecount: 0 }
}

luckydb[id].messagecount++;

if(n == 0){
  message.react("🍀")
  addLuckyPoints(1);
}
if(n2 == 0){
  message.react("🏆")
  message.react("👹")
  addLuckyPoints(10);
}
if(n3 == 0){
  message.react("👀")
  message.react("🧐")
  message.react("😶‍🌫️")
  message.react("🐸")
  message.channel.send("wtf")
  addLuckyPoints(100);
}
if(n4 == 0){
  client.user.setAvatar(message.author.avatarURL())
  message.channel.send("are you god?")
  message.react("👀")
  message.react("🧐")
  message.react("😶‍🌫️")
  message.react("🐸")
  message.react("🏆")
  message.react("👹")
  message.react("🍀")
  message.channel.send("congrats")
  message.channel.send(`${message.author.tag} HAS WON!!!!!!! the game of life`)
  addLuckyPoints(1000);
}
if(n5 == 0){
  message.channel.send("...")
  addLuckyPoints(99999999);
}

function addLuckyPoints(points, id=message.author.id){
  luckydb[id].points += points
  luckydb[id].messages.push([points, message.id, message.channel.id])
  luckydb[id].tag = message.author.tag

  console.log( JSON.stringify(luckydb) );

  fs.writeFileSync("luckyclover.json", JSON.stringify(luckydb) )
}
