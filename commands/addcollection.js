if(command == "m!addcollection"){

  let collection = collections[ args[2] ];
  let correctarr = [];
  let player = message.mentions.members.first();
  let element = args[3];

  for(var a = 0; a < collection.length; a++) if(collection[a] in maps) correctarr.push(collection[a]);
  console.log(correctarr);
  if(`${collection}` != `${correctarr}`){
    collections[args[2]] = correctarr;
    fs.writeFileSync("collections.json", JSON.stringify(collections));
  }

  if(!args[1]) return message.channel.send("Provide a player");
  if(!collection) return message.channel.send("Invalid Collection");
  if(!player){

    if(message.guild.members.get(args[1])+""!="undefined") player = message.guild.members.get(args[1]);
    else return message.channel.send("Invalid Player");
  }

  if(!element) return message.channel.send("Provide a map");
  if(player.id in database == false) return message.channel.send("Player not in database");

  let originalpoints = totalPoints(player.id);
  let addedCollections = "";
  let playerInfo = database[player.id];

  for(var a = 0; a < collection.length; a++){
    if(collection[a]+""==element){

      for(var b = a; b < collection.length; b++){
        if(playerInfo["maps"].indexOf(collection[b]) == -1) {
          addedCollections += `${collection[b]}: ${maps[collection[b]]["amount"]} points\n`;
          playerInfo["maps"].push(collection[b]);
        }
      }

      break;
    }
  }

  if(addedCollections.length == 0) addedCollections = "None";

  let currentpoints = totalPoints(player.id);

  addPointRoles(player, currentpoints);

  let plus = "";

  if(currentpoints > originalpoints) plus = "+"

  const embed = new Discord.RichEmbed();
  embed.setColor('#0099ff');
  embed.addField('User', playerInfo["name"]);
  embed.addField('Old-Points', originalpoints)
  embed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
  embed.addField('Added-Collections', addedCollections);
  embed.setThumbnail(player.user.avatarURL);

  message.channel.send(embed);

  fs.writeFileSync("points.json", JSON.stringify(database) )

}
