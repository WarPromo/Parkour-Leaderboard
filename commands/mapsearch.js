if(command == "m!map"){
  let map = args[1];
  let mapkeys = Object.keys(maps);
  let pages = createArray(mapkeys);
  let page = 0;
  let embed;

  if(!map) return message.channel.send("Provide a map");
  if(pages.length == 0) return message.channel.send("0 results");

  embed = createEmbed(page);

  let embedMessage = await message.channel.send(embed);

  await embedMessage.react("◀️");
  await embedMessage.react("▶️");

  let collector = embedMessage.createReactionCollector(reactionFilter, { time: 120000 })

  collector.on("collect", async (reaction, user) => {

    let embed;

    if(reaction.emoji.name == "▶️") page++;
    if(reaction.emoji.name == "◀️") page--;

    if(page < 0) page = 0;
    if(page > pages.length-1) page = pages.length-1;

    embed = createEmbed(page);

    embedMessage.edit( embed );
    reaction.users.remove( user );

  })

  function createEmbed(page){


    let embed = new Discord.MessageEmbed();
    let list = pages[page];

    embed.addField("Map Search", `${map} Page ${page} \nResults: ${list.length}`);

    for(var a = 0; a < list.length; a++){
      embed.addField(list[a], `Points: ${maps[list[a]]["amount"]} \nType: ${maps[list[a]]["type"]}`, true)
    }

    return embed;


  }

  function reactionFilter(reaction, user){
    if(user == client.user) return false;
    if(reaction.emoji.name == "▶️" || reaction.emoji.name == "◀️") return true;
    else return false;
  }

  function createArray(mapkeys){

    let pages = [];

    console.log(mapkeys);

    for(var a = 0; a < mapkeys.length; a++){
      if(mapkeys[a].includes( map ) ){

        if(pages.length == 0){
          pages.push([ mapkeys[a] ]);
        }
        else if(pages[pages.length - 1].length >= 9){
          pages.push([ mapkeys[a] ]);
        }
        else{
          pages[pages.length - 1].push( mapkeys[a] );
        }

      }
    }

    console.log(pages);

    return pages;


  }

}
