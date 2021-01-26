if(command == "m!profile" || command == "m!p"){

  let person = message.mentions.members.first();
  let mapArray = [];
  let embedPages = [];
  let mapKeys;
  let pageNumber = 0;

  if(!args[1]){
    person = message.member;
  }
  if(!person){
    if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);

    else return message.channel.send("Please provide a person");
  }

  if(person.id in database == false){
    database[person.id] = {"regularpoints": 0, "maps": [], "name": person.user.tag};
  }

  totalPoints(person.id)

  mapKeys = database[person.id]["maps"];

  let mapDatabase = Object.keys(maps);


  Loop1: for(var a = 0; a < mapKeys.length; a++){

    for(var b = 0; b < mapArray.length; b++){

      if(mapArray[b][0]+"" == maps[mapKeys[a]]["type"]){
        mapArray[b][1].push([ mapKeys[a], maps[mapKeys[a]]["amount"] ])
        continue Loop1;
      }

    }

    mapArray.push( [ maps[mapKeys[a]]["type"], [ [ mapKeys[a], maps[mapKeys[a]]["amount"] ] ] ] )
  }


  const embed = new Discord.RichEmbed();
  let globalRank = leaderboardArrayRank( "ALL", database[person.id]["name"] );

  embed.setColor(`#FD0061`);
  embed.addField('User', database[person.id]["name"]);
  //embed.addField('Total-Points', totalPoints(person.id) )
  embed.addField('Global', `#${globalRank}\nPoints: ${totalPoints(person.id)}\nBeaten: ${mapKeys.length}/${mapDatabase.length}`);
  embed.setThumbnail(person.user.avatarURL);

  for(map in mapArray){
    let type = mapArray[map][0];
    let rank = leaderboardArrayRank(type, database[person.id]["name"]);
    let points = totalPointsType(person.id, type);
    let count = 0;
    for(maptype in mapDatabase){
      if(maps[mapDatabase[maptype]]["type"] == type) count++;
    }

    embed.addField(`${type}`, `Rank: #${rank}\nPoints: ${points}\nBeaten: ${mapArray[map][1].length}/${count}`);

  }

  embedPages.push(embed);

  for(var a = 0; a < mapArray.length; a++){

    let mapname = mapArray[a][0];

    let sortedlist = mapArray[a][1].sort( function(a,b){ return -a[1] + b[1] } );
    let maplist = group( sortedlist, 20 );
    let rank = leaderboardArrayRank(mapname, database[person.id]["name"]);
    let totalpoints = totalPointsType(person.id, mapname);


    for(var b =0 ; b < maplist.length; b++){

      let embed = new Discord.RichEmbed();
      let mapstring = "";

      for(var c = 0; c < maplist[b].length; c++){
        mapstring += `Map: ${maplist[b][c][0]}, Points: ${maplist[b][c][1]}\n`;
      }

      //embed.addField(`${mapname}`, `#${rank}\nPoints: ${totalpoints}`)
      //embed.addField(`Total Points-${mapname}`, `${totalpoints}`);
      embed.addField(`${mapname} - Page ${b+1} / ${maplist.length}`, mapstring);
      embed.setColor(`#FD0061`);
      embedPages.push(embed);

    }

  }

  let embedMessage = await message.channel.send(embedPages[0]);
  await embedMessage.react("◀️");
  await embedMessage.react("▶️");

  let collector = embedMessage.createReactionCollector(reactionFilter, { time: 120000 })

  collector.on("collect", async (element, collector) => {

    let user = element.users.last();

    if(element._emoji.name == "▶️") pageNumber++;
    if(element._emoji.name == "◀️") pageNumber--;

    if(pageNumber < 0) pageNumber = 0;
    if(pageNumber > embedPages.length-1) pageNumber = embedPages.length-1;

    embedMessage.edit( embedPages[pageNumber] );
    element.remove( user );

  })

  function reactionFilter(reaction, user){
    if(user == client.user) return false;
    if(reaction.emoji.name == "▶️" || reaction.emoji.name == "◀️") return true;
    else return false;
  }

  function group(arr, length){
    let newarr = [];

    for(var a = 0; a < arr.length; a++){

      if(a == 0){
        newarr.push([ arr[a] ]);
      }
      else if(newarr[newarr.length-1].length >= length){
        newarr.push([ arr[a] ]);
      }
      else{
        newarr[newarr.length-1].push(arr[a]);
      }

    }

    return newarr;
  }

}
