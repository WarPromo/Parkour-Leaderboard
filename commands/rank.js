if(command == "m!rank"){

  let types = ["ALL"];

  let player = message.mentions.members.first();

  if(player) player = player.user.id;
  if(!args[1]) player = message.author.id;
  if(!player) player = args[1];
  if(player in database == false) return message.channel.send("Player not in database");

  let beaten = database[player]["maps"];

  let profile = message.guild.members.get(player).user.avatarURL;


  console.log(beaten);




  for(var a = 0; a < beaten.length; a++){

    if(types.indexOf(maps[beaten[a]]["type"]) == -1){
      types.push(maps[beaten[a]]["type"]);
    }

  }

  let embed = new Discord.RichEmbed();

  embed.setThumbnail(profile);
  embed.setColor("YELLOW");


  for(var a = 0 ; a < types.length; a++){
    let rank = leaderboardArrayRank(types[a], database[player]["name"]);
    let points = totalPointsType(player, types[a])
    if(types[a] == "ALL") points = totalPoints(player, types[a]);
    embed.addField(types[a] + ":", `#${rank}\nPoints: ${points}` );
  }

  message.channel.send(embed);




}
