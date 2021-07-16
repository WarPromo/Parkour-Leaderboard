
if(command == "addpoints"){


  let person = sender;
  let id = person.id;
  let name = person.user.tag;

  let points = args[2];
  let originalpoints;
  let currentpoints;

  originalpoints = totalPoints(id);

  database[id]["name"] = name;
  database[id]["regularpoints"] +=points;

  currentpoints = totalPoints(id);

  addPointRoles(person, currentpoints);

  let plus = "";

  if(currentpoints > originalpoints) plus = "+"

  const embed = new Discord.MessageEmbed();
  embed.setColor('#0099ff');
  embed.addField('User', person);
  embed.addField('Old-Points', originalpoints)
  embed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
  embed.setThumbnail(person.user.avatarURL());

  embed.toJSON();

  replyInteraction(interaction.id, interaction.token, embed);

  fs.writeFileSync("points.json", JSON.stringify(database) )

}
