
if(command == "profile"){

  const disbut = require("discord-buttons")

  let person = await guild.members.fetch(args[1]);
  let mapArray = [];
  let embedPages = [];
  let mapKeys;
  let pageNumber = 0;

  if(person.id in database == false){
    database[person.id] = {"regularpoints": 0, "maps": [], "name": person.user.tag};
  }


  totalPoints(person.id)

  mapKeys = database[person.id]["maps"];

  let mapDatabase = Object.keys(maps);
  let recieved = totalRecieved(person.id);


  Loop1: for(var a = 0; a < mapKeys.length; a++){

    for(var b = 0; b < mapArray.length; b++){

      if(mapArray[b][0]+"" == maps[mapKeys[a]]["type"]){
        mapArray[b][1].push([ mapKeys[a], maps[mapKeys[a]]["amount"] ])
        continue Loop1;
      }

    }

    mapArray.push( [ maps[mapKeys[a]]["type"], [ [ mapKeys[a], maps[mapKeys[a]]["amount"] ] ] ] )
  }


  const embed = new Discord.MessageEmbed();
  let globalRank = leaderboardArrayRank( "ALL", database[person.id]["name"] );

  embed.setColor(`#FD0061`);
  embed.addField('User', database[person.id]["name"]);
  //embed.addField('Total-Points', totalPoints(person.id) )
  embed.addField('Global', `#${globalRank}\nPoints: ${totalPoints(person.id)}\nBeaten: ${mapKeys.length}/${mapDatabase.length}`);
  embed.setThumbnail(person.user.avatarURL());

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

      let embed = new Discord.MessageEmbed();
      let mapstring = "";

      for(var c = 0; c < maplist[b].length; c++){
        mapstring += `Map: ${maplist[b][c][0]},  Points: ${maplist[b][c][1]},   **+${recieved[maplist[b][c][0]]}**\n`;
      }

      //embed.addField(`${mapname}`, `#${rank}\nPoints: ${totalpoints}`)
      //embed.addField(`Total Points-${mapname}`, `${totalpoints}`);
      embed.addField(`${mapname} - Page ${b+1} / ${maplist.length}`, mapstring);
      embed.setColor(`#FD0061`);
      embedPages.push(embed);

    }

  }

  let id = Date.now();

  let doubleback = new disbut.MessageButton()
    .setStyle('red')
    .setLabel('⏪')
    .setID('doubleback'+id)

  let back = new disbut.MessageButton()
    .setStyle('red')
    .setLabel('◀️')
    .setID('backward'+id)

  let forward = new disbut.MessageButton()
    .setStyle('red')
    .setLabel('▶️')
    .setID('forward'+id)

  let doublefor = new disbut.MessageButton()
    .setStyle('red')
    .setLabel('⏩')
    .setID('doublefor'+id)

  let row = new disbut.MessageActionRow()
    .addComponents(doubleback, back, forward, doublefor);

  let embedMessage = await replyInteraction(interaction.id, interaction.token, embedPages[0], "", row);

  client.on("clickButton", button)

  setTimeout(() => {
    client.off("clickButton", button)
  }, 120000);

  async function button(button){

    if(button.id.includes(id) == false) return;

    let embed;

    //button.reply.send("Edited", true);
    if(button.id == ("doublefor"+id)) pageNumber+=2;
    if(button.id == ("forward"+id)) pageNumber++;
    if(button.id == ("backward"+id)) pageNumber--;
    if(button.id == ("doubleback"+id)) pageNumber-=2;

    if(pageNumber < 0) pageNumber = 0;
    if(pageNumber > embedPages.length-1) pageNumber = embedPages.length-1;

    embedMessage.edit( embedPages[pageNumber] );

    console.log(embedPages[pageNumber], pageNumber)

    button.reply.defer();
    //reaction.users.remove( user );


    //button.reply(button.clicker.user.tag + " clicked the button");
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
