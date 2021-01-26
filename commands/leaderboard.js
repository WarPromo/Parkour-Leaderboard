
if(command == "m!leaderboard"){
  let keys = Object.keys(database);
  let type = args[1];
  let page = Math.floor( parseInt(args[2]) / 10 );
  let leaderboard;
  let embed;

  if(!args[1]) type = "ALL";
  if(!args[2]) page = 0;

  console.log(page);

  leaderboard = leaderboardArray(type, keys);

  if(leaderboard[0][0][1] == 0) return message.channel.send(`Everyone has 0 points for the type "${type}" `);

  if(page > leaderboard.length-1) page = leaderboard.length - 1;
  if(page < 0) page = 0;

  embed = createEmbed(page, leaderboard, type);

  let embedMessage = await message.channel.send(embed);

  await embedMessage.react("◀️");
  await embedMessage.react("▶️");

  let collector = embedMessage.createReactionCollector(reactionFilter, { time: 120000 })

  collector.on("collect", async (element, collector) => {

    let embed;
    let user = element.users.last();

    leaderboard = leaderboardArray(type, keys);

    if(element._emoji.name == "▶️") page++;
    if(element._emoji.name == "◀️") page--;

    if(page < 0) page = 0;
    if(page > leaderboard.length-1) page = leaderboard.length-1;

    embed = createEmbed(page, leaderboard, type);

    embedMessage.edit( embed );
    element.remove( user );

  })

  function reactionFilter(reaction, user){
    if(user == client.user) return false;
    if(reaction.emoji.name == "▶️" || reaction.emoji.name == "◀️") return true;
    else return false;
  }

  function leaderboardArray(type, keys){

    let pages = [];
    let leaderboard = [];

    for(var a = 0; a < keys.length; a++){

      let name = database[keys[a]]["name"];

      if(type != "ALL") leaderboard.push([ name, totalPointsType(keys[a], type) ]);
      else leaderboard.push([ name, totalPoints(keys[a], type) ]);

    }

    leaderboard.sort(function(a, b){return -a[1] + b[1]});

    for(var a = 0; a < leaderboard.length; a++){
      if(a == 0){
        pages.push( [ [ leaderboard[a][0], leaderboard[a][1]  ] ] )
      }
      else if(pages[pages.length - 1].length >= 10){
        pages.push( [ [ leaderboard[a][0], leaderboard[a][1]  ] ] )
      }
      else{
        pages[pages.length - 1].push( [ leaderboard[a][0], leaderboard[a][1]  ] );
      }
    }

    return pages;

  }

  function createEmbed(page, leaderboard, type){

    let embed = new Discord.RichEmbed();
    let rankings = leaderboard[page];

    let players = "";
    let points = "";
    let places = "";



    for(var a = 0; a < rankings.length; a++){
      places += `#${page*10 + a+1}\n`;
      players += `${rankings[a][0]}\n`;
      points += `${rankings[a][1]} Points\n`;
    }

    embed.addField(`Place`, places, true);
    embed.addField(`Leaderboard-${type}-${page}`, players, true);
    embed.addField(`Points`, points, true)


    return embed;

  }

}
