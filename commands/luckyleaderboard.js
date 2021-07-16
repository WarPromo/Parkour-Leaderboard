if(command == "m!luckylb"){
  let list = sortLuck(luckydb)

  console.log(list);

  let embed = new Discord.MessageEmbed();

  let players = "";
  let points = "";
  let luckiness = "";

  for(var a = 0; a < 10 && a < list.length; a++){
    players += "#"+(a+1)+". " + list[a][1].tag+"\n";
    points += list[a][1].points+"\n";
    luckiness += list[a][1].messagecount + "\n";
  }

  embed.addField("Leaderboard", players, true);
  embed.addField("Luck Points", points, true);
  embed.addField("Message Count        Luckiness", luckiness, true);

  embed.setColor("#00fc43")

  message.channel.send(embed);

}



function sortLuck(object){

  let arr = [];
  let keys = Object.keys(object);

  for(var a = 0; a < keys.length; a++) arr.push([keys[a], object[keys[a]]]);

  arr.sort(function(a, b){return -a[1].points + b[1].points} )

  return arr;

}
