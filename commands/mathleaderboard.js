if(command == "m!mathlb"){
  let list = sortMath(mathdb)

  console.log(list);

  let embed = new Discord.MessageEmbed();

  let players = "";
  let points = "";
  let set = "";
  let lasthighscore = -1
  let rank = 0

  for(var a = 0; a < 10 && a < list.length; a++){

    if(list[a][1].highscore[0]+"" != lasthighscore[0]+"") rank++
    lasthighscore = list[a][1].highscore

    players += "#"+rank+". " + list[a][1].tag+"\n";
    points += list[a][1].highscore[0]+"\n";

    let dt = Date.now() - list[a][1].highscore[1]
    dt = dt / 1000;
    dt = dt / 3600;
    dt = dt / 24;
    dt = Math.floor(dt);

    set += dt + " days ago \n";
  }

  embed.addField("Leaderboard", players, true);
  embed.addField("Highscore", points, true);
  embed.addField("Time Since", set, true);

  //embed.setColor("#00fc43")

  message.channel.send(embed);

}



function sortMath(object){

  let arr = [];
  let keys = Object.keys(object);

  for(var a = 0; a < keys.length; a++) arr.push([keys[a], object[keys[a]]]);

  arr.sort(function(a, b){return -a[1].highscore[0] + b[1].highscore[0]} )

  return arr;

}
