if(command == "m!profile" || command == "m!p"){

  let person = message.mentions.members.first();
  let mapArray = [];
  let mapKeys;

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

    console.log(mapKeys[a]);

    for(var b = 0; b < mapArray.length; b++){

      if(mapArray[b][0]+"" == maps[mapKeys[a]]["type"]){
        mapArray[b][1].push([ mapKeys[a], maps[mapKeys[a]]["amount"] ])
        continue Loop1;
      }

    }

    mapArray.push( [ maps[mapKeys[a]]["type"], [ [ mapKeys[a], maps[mapKeys[a]]["amount"] ] ] ] )
  }




  const exampleEmbed = new Discord.RichEmbed();

  let globalRank = leaderboardArrayRank( "ALL", database[person.id]["name"] );

  exampleEmbed.setColor('#0099ff');
  exampleEmbed.addField('User', database[person.id]["name"]);
  exampleEmbed.addField('Total-Points', totalPoints(person.id) )
  exampleEmbed.addField('Global-Rank', "#"+globalRank);

  for(var a = 0; a < mapArray.length; a++){

    let mapString = "";
    let rank = leaderboardArrayRank( mapArray[a][0], database[person.id]["name"] );
    let total = 0;
    let totalpoints = totalPointsType( person.id, mapArray[a][0] );


    for(var b = 0; b < mapDatabase.length; b++){
      if(maps[mapDatabase[b]]["type"] == mapArray[a][0]+""){
        total++;
      }
    }

    mapArray[a][1].sort( function(a,b){ return -a[1] + b[1] } );

    for(var b = 0; b < mapArray[a][1].length; b++){
      mapString += `${mapArray[a][1][b][0]}: ${mapArray[a][1][b][1]} points\n`;
    }

    exampleEmbed.addField(`Type: ${mapArray[a][0]}\nRank: #${rank}\nBeaten ${mapArray[a][1].length} / ${total}\nPoints: ${totalpoints}`, mapString, true);
  }



  exampleEmbed.setThumbnail(person.user.avatarURL);

  message.channel.send(exampleEmbed);

}
