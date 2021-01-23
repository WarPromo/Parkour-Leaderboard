if(command == "m!createmap"){


  let map = args[1];
  let points = parseInt(args[2]);
  let type = args[3];

  console.log(points);

  if(!map) return message.channel.send("Provide a map to set the points to");

  if(!args[2] || parseInt(args[2])+"" == "NaN") return message.channel.send("Provide an integer point amount");

  if(!type) return message.channel.send("Please set a type");

  if(map in maps) message.channel.send(`Changing ${map} which is set to ${maps[map]} points`)
  maps[map] = {amount: points, type: type};

  message.channel.send(`${map} is now set to ${points} points`);

  fs.writeFileSync("maps.json", JSON.stringify(maps) );

}
