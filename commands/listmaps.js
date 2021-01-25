if(command == "m!listmaps"){

  let page = 0;
  let arr = objectArray(maps);
  let pages;
  let filter = "";
  let embed;

  if(args[1]){
    filter = args[1];
    arr = arr.filter(element => element[2]+"" == args[1]+"");
  }

  pages = createArray(arr);
  embed = createEmbed(page);

  let embedMessage = await message.channel.send(embed);

  await embedMessage.react("◀️");
  await embedMessage.react("▶️");

  let collector = embedMessage.createReactionCollector(reactionFilter, { time: 120000 })

  collector.on("collect", async (element, collector) => {

    let embed;
    let user = element.users.last();

    if(element._emoji.name == "▶️") page++;
    if(element._emoji.name == "◀️") page--;

    if(page < 0) page = 0;
    if(page > pages.length-1) page = pages.length-1;

    embed = createEmbed(page);

    embedMessage.edit( embed );
    element.remove( user );

  })

  function reactionFilter(reaction, user){
    if(user == client.user) return false;
    if(reaction.emoji.name == "▶️" || reaction.emoji.name == "◀️") return true;
    else return false;
  }

  function createEmbed(page){
    let part = pages[page];
    let embed = new Discord.RichEmbed();

    embed.addField("Maps", `Page ${page} ${filter}`);

    for(var a = 0; a < part.length; a++){
      embed.addField(part[a][0], `Points: ${part[a][1]}\nType: ${part[a][2]}`, true);
    }

    return embed;

  }

  function createArray(arr){

    let pages = [];

    for(var a = 0; a < arr.length; a++){

      if(a == 0){
        pages.push([ arr[a] ]);
      }
      else if(pages[pages.length - 1].length >= 9){
        pages.push([ arr[a] ]);
      }
      else{
        pages[pages.length - 1].push( arr[a] );
      }

    }

    return pages;

  }

  function objectArray(object){

    let arr = [];
    let keys = Object.keys(object);

    for(var a = 0; a < keys.length; a++){
      arr.push([ keys[a], object[ keys[a] ]["amount"], object[ keys[a] ]["type"] ]);
    }

    console.log(arr);

    return arr;

  }

}
