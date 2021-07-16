if(command == "addmaps"){



  let correctarr = [];
  let player = sender;
  let element = args[2].split(" ");


  console.log(args)

  console.log(element);


  if(!element) return replyInteraction(interaction.id, interaction.token, "","Provide a map");
  if(player.id in database == false) return replyInteraction(interaction.id, interaction.token, "","Player not in database");
  //if(collection.indexOf(element) == -1) return replyInteraction(interaction.id, interaction.token, "", `Map "${element}" not in collection`);

  let originalpoints = totalPoints(player.id);
  let addedCollections = "";
  let playerInfo = database[player.id];

  for(var a = 0; a < element.length; a++) if(element[a] in maps) correctarr.push(element[a]);

  console.log(correctarr);

  for(var a = 0; a < correctarr.length; a++){
    if(playerInfo["maps"].indexOf(correctarr[a]) == -1){
      playerInfo["maps"].push(correctarr[a]);
      addedCollections += `${correctarr[a]}: ${maps[correctarr[a]]["amount"]} points\n`;
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
  embed.addField('Added-Maps', addedCollections);
  embed.setThumbnail(player.user.avatarURL());

  embed.toJSON();

  replyInteraction(interaction.id, interaction.token, embed);

  fs.writeFileSync("points.json", JSON.stringify(database) )

}
