if(command===`m!testcmd`||command===`m!tc`){
  let embed = new Discord.RichEmbed()
  let mapexample = maps
  let playerexample = database;

  let playerKeys = Object.keys(playerexample);

  embed.setTitle("Test Command")
  embed.setAuthor(message.author.username, message.author.avatarURL)
  embed.setColor("LUMINOUS_VIVID_PINK")
  for(var a=0; a<playerKeys.length&&a<9; a++){
    let playerName = playerKeys[a]
    let displayName = playerexample[ playerName ].name;
    let playerMaps = playerexample[ playerName ].maps;

    embed.addField(displayName, playerMaps)
  }
  message.channel.send(embed)
}
