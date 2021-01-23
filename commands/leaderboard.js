
    if(command == "m!leaderboard"){
      let leaderboard = [];
      let keys = Object.keys(database);
      let type = args[1];
      let page = Math.floor( parseInt(args[2]) / 10 );

      if(!args[1]) type = "ALL";
      if(!args[2]) page = 0;

      for(var a = 0; a < keys.length; a++){

        let name = database[keys[a]]["name"];

        if(type != "ALL") leaderboard.push([ name, totalPointsType(keys[a], type) ]);
        else leaderboard.push([ name, totalPoints(keys[a], type) ]);

      }

      leaderboard.sort(function(a, b){return -a[1] + b[1]});

      if(leaderboard[0][1] == 0) return message.channel.send(`Everyone has 0 points for the type "${type}" `);
    
      if(page*10 > leaderboard.length-1) page = Math.floor( ( (leaderboard.length - 1) / 10) );
      if(page < 0) page = 0;

      const exampleEmbed = new Discord.RichEmbed();
      exampleEmbed.setColor('#0099ff');

      let players = "";

      for(var a = page * 10; a < page*10 + 10 && a <   leaderboard.length; a++){
        players += `${a + 1}. ${leaderboard[a][0]}: ${leaderboard[a][1]} points \n`;
      }

      exampleEmbed.addField("LEADERBOARD-" + type + "-" + page, players);

      let msg = await message.channel.send(exampleEmbed);

      await msg.react("◀️");
      await msg.react("▶️");

    }
