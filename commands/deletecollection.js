if(command == "m!deletecollection"){
  let name = args[1];

  if(name in collections == false) return message.channel.send("Collection not in database");

  delete collections[name];

  fs.writeFileSync("collections.json", JSON.stringify(collections));

  message.channel.send("Collection deleted");
}
