if(command == "m!renamemap"){

  console.log("Command called");

  if(!args[1]) return message.channel.send(`Provide the name of the map you want to rename`)

  let map = args[1].toUpperCase();

  if(map in maps == false) return message.channel.send(`The map '${map}' does not exist`)

  if(!args[2]) return message.channel.send(`Provide the new name for the map '${map}'`)

  let newname = args[2].toUpperCase();

  if(newname in maps) return message.channel.send(`That mapname already exists`);



  let property = JSON.parse(JSON.stringify(maps[map]))
  maps[newname] = property;
  delete maps[map];


  for(p in database){
    let player = database[p]
    let completedmaps = database[p]["maps"]
    let index = completedmaps.indexOf(map)

    if( index != -1  ) {

      completedmaps[index] = newname

    }
  }

  for(c in collections){
    let m = collections[c]
    let index = m.indexOf(map)
    if(index != -1){
      m[index] = newname;
    }
  }

  fs.writeFileSync("collections.json", JSON.stringify(collections) );
  fs.writeFileSync("maps.json", JSON.stringify(maps) );
  fs.writeFileSync("points.json", JSON.stringify(database) )

  return message.channel.send(`Map '${map}' has been renamed to '${newname}'!`)

}
