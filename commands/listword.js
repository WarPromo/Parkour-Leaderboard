if(command == 'm!word'){
  let searchword = args[1];

  if(!args[1]) searchword = "ALL";

  let words = [];
  let pages = [];
  let page = 0;

  for(word in definitions){

    if(word.includes(searchword) || searchword == "ALL"){
      words.push([word, definitions[word]]);
    }

  }

  for(word in definitions){
    if(searchword == "ALL") break;
    if(word.includes(searchword) ) continue;

    if(definitions[word].definition.includes(searchword) || searchword == "ALL"){
      words.push([word, definitions[word]]);
    }

  }

  let resultsAmount = words.length;

  words = group(words, 4);

  if(words.length == 0) return message.channel.send("0 Results");

  createEmbed();

  let embedMessage = await message.channel.send(pages[0]);
  let collector = embedMessage.createReactionCollector(reactionFilter, { time: 120000 })

  await embedMessage.react("◀️");
  await embedMessage.react("▶️");

  collector.on("collect", async (element, collector) => {

    let user = element.users.last();

    if(element._emoji.name == "▶️") page++;
    if(element._emoji.name == "◀️") page--;

    if(page < 0) page++;
    if(page > pages.length-1) page--;

    embedMessage.edit( pages[page] );
    element.remove( user );

  })

  function reactionFilter(reaction, user){
    if(user == client.user) return false;
    if(reaction.emoji.name == "▶️" || reaction.emoji.name == "◀️") return true;
    else return false;
  }

  function group(arr, length){
    let newarr = [];

    for(element in arr){

      if(element == 0){
        newarr.push([ arr[element] ]);
      }
      else if(newarr[newarr.length-1].length >= length){
        newarr.push([ arr[element] ]);
      }
      else{
        newarr[newarr.length-1].push(arr[element]);
      }

    }

    return newarr;
  }

  function createEmbed(){

    for( list in words ){
      //list is basically the page oh gotchu
      let embed = new Discord.RichEmbed();
      let group = words[list];
      embed.setColor("#FF0061")



      if(list == 0){
        embed.setTitle(`Search "${searchword}"`);
        embed.addField("Results", resultsAmount);
      }

      for(word in group){

        let term = group[word][1];
        let definition = term.definition;
        let author = message.guild.members.get( term.user ).user.tag;
        if(!author) author = "Couldn't find";
        let date = term.date;

        embed.addField(group[word][0], `Author: ${author}\nDefinition: **${definition}**\nDate: ${date}`, false);

      }

      pages.push(embed);
    }

  }

}
