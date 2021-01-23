if(command == "m!map"){
  let map = args[1];
  let mapkeys = Object.keys(maps);

  if(!map) return message.channel.send("Provide a map");

  let list = [];

  for(var a = 0; a < mapkeys.length; a++){
    if(mapkeys[a].includes(map.toUpperCase() ) ) list.push(mapkeys[a]);
  }

  let embed = new Discord.RichEmbed();
  embed.addField("Map Search", `${map} Page 0 \nResults: ${list.length}`);
  for(var a = 0; a < list.length && a < 9; a++){
    embed.addField(list[a], `Points: ${maps[list[a]]["amount"]} \nType: ${maps[list[a]]["type"]}`, true)
  }
  let msg = await message.channel.send(embed);
  await msg.react("◀️");
  await msg.react("▶️");

}
