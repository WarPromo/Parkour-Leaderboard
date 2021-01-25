

if(command == "m!search"){

  if(!args[1]) return message.channel.send("Provide a search term");
  let term = content.substring(8, message.content.length);
  let url = `https://www.mcpk.wiki/w/index.php?search=${term}&title=Special%3ASearch&profile=default&fulltext=1`

  let searchResults = [];

  request(url, async (error, response, body) => {

    let pageNumber = 0;
    let embed;

    let convertToCheerio = cheerio.load(body);
    let searchArray = convertToCheerio(`li[class=mw-search-result]`);


    if(searchArray.length == 0) return message.channel.send("No results found");

    createArray(convertToCheerio, searchArray, body);

    embed = createEmbed(0);

    let embedMessage = await message.channel.send(embed);
    await embedMessage.react("◀️");
    await embedMessage.react("▶️");

    let collector = embedMessage.createReactionCollector(reactionFilter, { time: 120000 })

    collector.on("collect", async (element, collector) => {

      let embed;
      let user = element.users.last();

      if(element._emoji.name == "▶️") pageNumber++;
      if(element._emoji.name == "◀️") pageNumber--;

      if(pageNumber < 0) pageNumber = 0;
      if(pageNumber > searchResults.length-1) pageNumber = searchResults.length-1;

      embed = createEmbed(pageNumber);

      embedMessage.edit( embed );
      element.remove( user );

    })

  });

  function reactionFilter(reaction, user){
    if(user == client.user) return false;
    if(reaction.emoji.name == "▶️" || reaction.emoji.name == "◀️") return true;
    else return false;
  }

  function createArray(convertToCheerio, searchArray, body){

    searchArray.each( (i, part) => {

      let text = convertToCheerio(part).text();
      let title = text.split("    ")[0];
      let linkTitle = title.split(" ").join("_");


      text = text.substring(title.length + 4, text.length);

      let newtext = `[Link](https://www.mcpk.wiki/wiki/${linkTitle})` + "```" + text + "```";

      if(i == 0){
        searchResults.push( [ [title, text] ] );
      }
      else if(searchResults[searchResults.length - 1].length >= 4 ){
        searchResults.push( [ [title, text] ] );
      }
      else{
        searchResults[searchResults.length - 1].push( [title, text] );
      }

    });

    /*
    searchArray = [
    [
      ["Title", "Text"], ["Title", "Text"],
      ["Title", "Text"], ["Title", "Text"],
    ], 
    [
      ["Title", "Text"], ["Title", "Text"],
      ["Title", "Text"], ["Title", "Text"],
    ] etc.]
    */

  }

  function createEmbed(page){

    let embed = new Discord.RichEmbed();
    let wikipage = searchResults[page];

    embed.addField("MCPK SEARCH", `PAGE ${page} ${term}`)

    for(var a = 0; a < wikipage.length; a++){
      embed.addField(wikipage[a][0], wikipage[a][1]);
    }

    return embed;

  }

}
