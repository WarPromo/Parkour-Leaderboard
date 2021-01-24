

if(command == "m!search"){

  if(!args[1]) return message.channel.send("Provide a search term");

  let term = content.substring(8, message.content.length);

  let url = `https://www.mcpk.wiki/w/index.php?search=${term}&title=Special%3ASearch&profile=default&fulltext=1`

  request(url, async (error, response, body) => {

    let embed = new Discord.RichEmbed();

    embed.addField("MCPK WIKI", "PAGE 0 " + term);

    let convertToCheerio = cheerio.load(body);

    let searchArray = convertToCheerio(`li[class=mw-search-result]`);

    if(searchArray.length == 0) return message.channel.send("No results found");


    embed.addField("Results", searchArray.length);

    searchArray.each( (i, part) => {
      let text = convertToCheerio(part).text();
      let title = text.split("    ")[0];
      let linkTitle = title.split(" ").join("_");

      text = text.substring(title.length + 4, text.length);

      let newtext = `[Link](https://www.mcpk.wiki/wiki/${linkTitle})` + "```" + text + "```";

      if(i < 4) embed.addField(title, newtext);
    });

    searchedCommands[term] = body;

    let m = await message.channel.send(embed);
    await m.react("◀️");
    await m.react("▶️");

  });

}
