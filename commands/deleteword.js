if(command == "m!deleteword"){
  let word = args[1];

  if(!args[1]) return message.channel.send("Provide a word to delete");
  if(args[1] in definitions == false) return message.channel.send("Word not in database");
  if(definitions[args[1]].user != message.author.id && isstaff == false){
    return message.channel.send("No permissions, only staff members");
  }

  message.channel.send("Deleting word " + word + " ...");
  delete definitions[word];
  fs.writeFileSync("definitions.json", JSON.stringify(definitions) );
  message.channel.send("Word deleted");
}
