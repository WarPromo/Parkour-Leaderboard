

if(command == "!reactiontest"){

  console.log("got here");
  let page = 0;

  let mapsList = Object.keys(maps);

  let noOfPages = Math.floor(mapsList.length/9);
  let totalMaps = mapsList.length;

  let dummyEmbed = new Discord.RichEmbed();
  dummyEmbed.setTitle("Map List - Page 0/"+noOfPages)
            .setColor('#0099ff');

  for( var a=page*9; a<mapsList.length-1 && a<page*9+9; a++ ){
    //its maps not object, i store the maps in maps
    let type = maps[ mapsList[a] ]["type"];
    let amount = maps[ mapsList[a] ]["amount"];
    let mapInfo="";
    mapInfo+=`Type: ${type}\nAmount: ${amount}`;

    dummyEmbed.addField( mapsList[a] , mapInfo , true );
  }

  dummyEmbed.addField("Info:", "Total Maps: "+totalMaps);

  //What about over here?
  let myMessage = await message.channel.send(dummyEmbed);

  await myMessage.react("◀️");
  await myMessage.react("▶️");

  let reactionCollector = myMessage.createReactionCollector( reactionFilter, {time: 120000} );

  reactionCollector.on("collect", (element, collector) => {

    let emoji = element._emoji.name;

    let mapEmbed = new Discord.RichEmbed();

    if(emoji == "▶️"){
      //plus 10 to page number
      page++;
    }
    if(emoji == "◀️"){
      //minus 10 to page number
      page--;
    }

    if(page < 0) page=0;

    if(page*9 > mapsList.length) page--;

    //Math.floor(1.5) = 1
    //Math.floor(1.9) = 1
    //Math.floor(2.1) = 2
    //Math.floor function
    //ooh okay i got it thanks



    mapEmbed.setTitle('Map List - Page '+page+"/"+noOfPages);
    mapEmbed.setColor('#0099ff');


    for( var a=page*9; a<mapsList.length-1 && a<page*9+9; a++ ){
      //its maps not object, i store the maps in maps
      let type = maps[ mapsList[a] ]["type"];
      let amount = maps[ mapsList[a] ]["amount"];
      let mapInfo="";

      mapInfo+=`Type: ${type}\nAmount: ${amount}`;

      mapEmbed.addField( mapsList[a] , mapInfo , true );
    }

    mapEmbed.addField("Info:", "Total Maps: "+totalMaps);

    myMessage.edit(mapEmbed);

    let user = element.users.last();

    element.remove(user);

  })

  function reactionFilter(reaction, user){

    if(user.bot) return false;
    if(reaction.emoji.name==='◀️'||reaction.emoji.name==='▶️') return true;
    else return false;

  }




}
