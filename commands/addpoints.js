if(command == "m!addpoints"){


  let person = message.mentions.members.first();
  let id = person.id;
  let name = person.user.tag;

  let points = parseInt(args[2]);
  let originalpoints;
  let currentpoints;

  if(!args[1]) return message.channel.send("Provide a person");
  if(!args[2] || parseInt(args[2])+"" == "NaN" ) return message.channel.send("Provide an integer point amount to add");
  if(!person){
    if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);
    else return message.channel.send("Invalid Player");
  }
  if(!person) return message.channel.send("Invalid player");
  if(person.id in database == false) return message.channel.send("Person not in database");


  originalpoints = totalPoints(id);

  database[id]["name"] = name;
  database[id]["regularpoints"] +=points;

  currentpoints = totalPoints(id);

  addPointRoles(person, currentpoints);

  let plus = "";

  if(currentpoints > originalpoints) plus = "+"

  const exampleEmbed = new Discord.RichEmbed();
  exampleEmbed.setColor('#0099ff');
  exampleEmbed.addField('User', person);
  exampleEmbed.addField('Old-Points', originalpoints)
  exampleEmbed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
  exampleEmbed.setThumbnail(person.user.avatarURL);

  message.channel.send(exampleEmbed);

  fs.writeFileSync("points.json", JSON.stringify(database) )

}
