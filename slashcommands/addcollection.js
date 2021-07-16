if(command == "addcollection"){

  let collection = collections[ args[2] ];
  let correctarr = [];
  let player = sender;
  let element = args[3];

  if(!collection) return replyInteraction(interaction.id, interaction.token, "",`Invalid Collection "${args[2]}"`);
  if(!element) return replyInteraction(interaction.id, interaction.token, "","Provide a map");
  if(player.id in database == false) return replyInteraction(interaction.id, interaction.token, "","Player not in database");
  if(collection.indexOf(element) == -1) return replyInteraction(interaction.id, interaction.token, "", `Map "${element}" not in collection`);

  let originalpoints = totalPoints(player.id);
  let addedCollections = "";
  let playerInfo = database[player.id];

  for(var a = 0; a < collection.length; a++) if(collection[a] in maps) correctarr.push(collection[a]);
  console.log(correctarr);
  if(`${collection}` != `${correctarr}`){
    collections[args[2]] = correctarr;
    fs.writeFileSync("collections.json", JSON.stringify(collections));
  }

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

  const embed = new Discord.MessageEmbed();
  embed.setColor('#0099ff');
  embed.addField('User', playerInfo["name"]);
  embed.addField('Old-Points', originalpoints)
  embed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
  embed.addField('Added-Collections', addedCollections);
  embed.setThumbnail(player.user.avatarURL());

  embed.toJSON();

  replyInteraction(interaction.id, interaction.token, embed);

  fs.writeFileSync("points.json", JSON.stringify(database) )

}
