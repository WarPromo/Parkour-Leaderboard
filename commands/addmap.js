if(command == "m!addmap"){

  let person = message.mentions.members.first();

  if(!person) return message.channel.send("Provide a person");

  let map = args[2];

  console.log(map);

  if(!map) return message.channel.send("Provide a map");
  if(!args[1]) return message.channel.send("Provide a person");
  if(map in maps == false) return message.channel.send("Map not in database");
  if(!person){
    if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);
    else return message.channel.send("Invalid Player");
  }
  if(person.id in database == false) return message.channel.send("Player not in database");
  if(database[person.id]["maps"].indexOf(map) != -1 ) return message.channel.send("Player already beat that map");

  let originalpoints = totalPoints(person.id);
  database[person.id]["maps"].push(map);
  let currentpoints = totalPoints(person.id);

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
