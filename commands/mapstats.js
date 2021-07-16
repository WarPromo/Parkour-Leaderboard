if(command === 'm!mapstats' || command == 'm!ms'){
  console.log("Command called");
  let players = Object.keys(database); //["312312321321", "312321312312", "3123213213213"] (id)

  let page = 0;

  let map = args[1];

  if(!map) return message.channel.send("Provide a map");
  if(!(map in maps)) return message.channel.send(`${map} is not in the maps database`);

  let totalPlayers = players.length;

  let beatenBy = [];
  let beatenAmount = 0;

  for(player in players){
    var playerInfo = database[ players[player] ];

    var playerMaps = playerInfo["maps"];
    for(playerMap in playerMaps){
      if(playerMaps[playerMap] === map) beatenBy.push(playerInfo["name"]);
    }

  }

  beatenAmount = beatenBy.length;

  let statsMessage = await message.channel.send(createEmbed(page, beatenAmount));

  await statsMessage.react('◀️');
  await statsMessage.react('▶️');

  let reactionCollector = statsMessage.createReactionCollector(reactionFilter, {time: 120000});

  reactionCollector.on("collect", (reaction, user) => {

    let emoji = reaction._emoji.name;

    if(emoji === '◀️') page--;
    if(emoji === '▶️') page++;

    if(page < 0) page = 0;
    if(page * 10 > beatenBy.length-1) page--;

    let embed = createEmbed(page, beatenAmount);

    statsMessage.edit(embed);

    reaction.users.remove(user);

  })

  function createEmbed(pageNumber, playerAmount){

    let playerString = `Page ${pageNumber}/${Math.floor(playerAmount/10)}\n\`\`\``;

    let statsEmbed = new Discord.MessageEmbed();
    statsEmbed.setTitle(`Map Stats - ${map}`)
              .setColor("#FD0061")
              .addField("Map Type:", maps[map]["type"])
              .addField("Map Points:", maps[map]["amount"]);
    for(var playerName = pageNumber * 10; playerName < pageNumber * 10 + 10 && playerName < playerAmount; playerName++){
      playerString += beatenBy[playerName] + '\n';
    }

    playerString += '\`\`\`';

    statsEmbed.addField(`Beaten by ${playerAmount} players:`, playerString);
    return statsEmbed;

  }

  function reactionFilter(reaction, user){

    if(user.bot) return false;
    if(reaction.emoji.name === '◀️' || reaction.emoji.name === '▶️') return true;
    else return false;

  }


  //◀️▶️
}
