if(command == "removemap"){

  let person = sender;
  let map = args[2];

  console.log(map);

  if(person.id in database == false) return replyInteraction(interaction.id, interaction.token, "", "Player not in database")
  if(map in maps == false) return replyInteraction(interaction.id, interaction.token, "", "Map not in database")
  if(database[person.id]["maps"].indexOf(map) == -1 ) return replyInteraction(interaction.id, interaction.token, "", "Player hasn't beaten that map")

  let originalpoints = totalPoints(person.id);
  let arr = database[person.id]["maps"];
  let newarr = [];

  for(var a = 0; a < arr.length; a++) if(arr[a]+""!=map) newarr.push(arr[a]);

  database[person.id]["maps"] = newarr;

  let currentpoints = totalPoints(person.id);

  addPointRoles(person, currentpoints);

  let plus = "";

  if(currentpoints > originalpoints) plus = "+"

  const embed = new Discord.MessageEmbed();
  embed.setColor('#0099ff');
  embed.addField('User', person);
  embed.addField('Old-Points', originalpoints)
  embed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
  embed.setThumbnail(person.user.avatarURL());

  replyInteraction(interaction.id, interaction.token, embed);

  fs.writeFileSync("points.json", JSON.stringify(database) )

}
