if(command == "m!listmaps"){


  let arr = objectArray(maps);

  if(args[1]) arr = arr.filter(element => element[2]+"" == args[1]+"");

  let filter="";

  if(args[1]) filter = args[1];

  const embed = new Discord.RichEmbed();
  embed.addField("Maps", `Page 0 ${filter}`);

  for(var a = 0; a < arr.length && a < 9; a++){
    embed.addField(`${arr[a][0]}`, `Points: ${arr[a][1]}\nType: ${arr[a][2]}`, true)
  }

  message.channel.send(embed).then(async m => {
    await m.react("◀️");
    await m.react("▶️");
  });

}
