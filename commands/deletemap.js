if(command == "m!deletemap"){


  let map = args[1];

  if(!map) return message.channel.send("Provide a map to remove");
  if(map in maps == false) return message.channel.send("Map not in database");

  let originalpoints = maps[map]["amount"];

  delete maps[map];

  message.channel.send(`Deleted ${map} which was set to ${originalpoints} points`);

  fs.writeFileSync("maps.json", JSON.stringify(maps) );
}
