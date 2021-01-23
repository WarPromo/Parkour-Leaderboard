if(command == "m!createcollection"){


  console.log("Its this command");

  let name = args[1];

  if(!name) return message.channel.send("Make a name for the collection");
  if(!args[2]) return message.channel.send("Tell whats in the collection");

  let collection = args[2].split(",");

  for(var a = 0; a < collection.length; a++) {
    if(collection[a] in maps == false) {
      return message.channel.send(`Invalid Map: ${collection[a]}`);
    }
  }

  if(name in collections) message.channel.send(`Replacing ${name} which is set to ${collections[name]}...`);

  collections[name] = collection;

  message.channel.send(`${name} is now set to ${collection.join(",")}`);

  fs.writeFileSync("collections.json", JSON.stringify(collections));

}
