if(command == "m!createplayer"){

  console.log("Command called");


  let player = message.mentions.members.first();

  if(!player) return message.channel.send("Provide a player");
  if(player.id in database) return message.channel.send("Player already exists");

  database[player.id] = {"regularpoints": 0, "maps": [], "name": player.user.tag};

  const embed = new Discord.RichEmbed();

  embed.setColor('#0099ff');
  embed.addField('User', database[player.id]["name"]);
  embed.addField('Total-Points', totalPoints(player.id) )
  embed.addField(`Beaten Maps 0 / ${Object.keys(maps).length}`, `None`);
  embed.setThumbnail(player.user.avatarURL);

  fs.writeFileSync("points.json", JSON.stringify(database) )

  return message.channel.send(embed);
}
