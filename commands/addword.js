if(command == "m!addword"){
  let content = message.content;
  let words = content.split(" ");
  let word = words[1].toUpperCase();
  let sentence = content.substring(word.length + 10, content.length);

  if(word in definitions){

    return message.channel.send("Word already exists");

  }

  if(sentence.includes(`"`)) return message.channel.send(`You cannot include " in your definition, use ' instead`);

  definitions[word] = {
    definition: sentence,
    user: message.author.id,
    date: new Date().toLocaleString()
  };


  fs.writeFileSync("definitions.json", JSON.stringify(definitions) )

  return message.channel.send("Definition has been set");

}
