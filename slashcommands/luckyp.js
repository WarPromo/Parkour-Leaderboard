if(command == "luckyp"){

  console.log("GOT HERE");

  const disbut = require("discord-buttons");

  let player = await guild.members.fetch(args[1]);

  if(!args[1]){
    player = creator
  }

  console.log("The player is " + player.id);

  if(player.id in luckydb == false){
    luckydb[player.id] = { points: 0, messages: [], tag: player.user.tag, messagecount: 0 }
  }

  let embeds = embedPages( player );

  let id = Date.now();

  let doubleback = new disbut.MessageButton()
    .setStyle('green')
    .setLabel('⏪')
    .setID('doubleback'+id)

  let back = new disbut.MessageButton()
    .setStyle('green')
    .setLabel('◀️')
    .setID('backward'+id)

  let forward = new disbut.MessageButton()
    .setStyle('green')
    .setLabel('▶️')
    .setID('forward'+id)

  let doublefor = new disbut.MessageButton()
    .setStyle('green')
    .setLabel('⏩')
    .setID('doublefor'+id)

  let row = new disbut.MessageActionRow()
    .addComponents(doubleback, back, forward, doublefor);

  let embedMessage = await replyInteraction(interaction.id, interaction.token, embeds[0], "", row);


  let page = 0;

  client.on("clickButton", button)

  setTimeout(() => {
    client.off("clickButton", button)
  }, 120000);

  async function button(button){

    if(button.id.includes(id) == false) return;

    let embed;

    //button.reply.send("Edited", true);
    if(button.id == ("doublefor"+id)) page+=2;
    if(button.id == ("forward"+id)) page++;
    if(button.id == ("backward"+id)) page--;
    if(button.id == ("doubleback"+id)) page-=2;

    if(page < 0) page = 0;
    if(page > embeds.length-1) page = embeds.length-1;

    embedMessage.edit( embeds[page] );

    button.reply.defer();
    //reaction.users.remove( user );


    //button.reply(button.clicker.user.tag + " clicked the button");
  }


  //console.log( embedPages( "283745683507249152" ) );


}


function embedPages(player){


  let arr = luckydb[player.id].messages;
  let perpage = 5;
  let obj = sortLuck(luckydb);
  let ranking = 0;
  let embeds = []

  for(var a = 0; a < obj.length; a++){
    if(obj[a][0] == player){
      ranking = a+1;
      break;
    }
  }

  let embed = new Discord.MessageEmbed();

  console.log(player.user.avatarURL());

  let amounts = "";

  embed.addField("Player", luckydb[player.id].tag );
  embed.addField("Ranking", `#${ranking}`);
  embed.addField("Points", `${luckydb[player.id].points}`);
  embed.addField("Messages", `${luckydb[player.id].messagecount}`);
  embed.addField("Luckiness", `${ ((luckydb[player.id].points / luckydb[player.id].messagecount)+"").substring(0, 6) }`);
  embed.setThumbnail(player.user.avatarURL());
  embed.setColor("#00fc43");

  embeds.push(embed);



  //console.log(arr);

  console.log("Got here")

  if(arr.length > 0){

    console.log("True " + arr)

    arr.sort( (a,b) => {
      return b[0] - a[0]
    } )

    let parr = [            [ arr[0][0], [ [] ] ]                  ]

    for(var a = 0; a < arr.length; a++){

      if( parr[parr.length-1][0] != arr[a][0] ){
        parr.push( [ arr[a][0], [ [] ] ] )
      }

      if( parr[parr.length-1][1][ parr[parr.length-1][1].length-1 ].length >= perpage ){

        parr[parr.length-1][1].push( [] )

      }

      parr[parr.length-1][1][ parr[parr.length-1][1].length-1 ].push( [ arr[a][2], arr[a][1] ] )

    }

    for(var a = 0; a < parr.length; a++){
      for(var b = 0; b < parr[a][1].length; b++){

        let page = b;
        let name = parr[a][0]
        let embed = new Discord.MessageEmbed();

        let links = "";

        for(var c = 0; c < parr[a][1][b].length; c++){
          links += `${b*perpage + c + 1} - [Click here](https://discord.com/channels/793172726767550484/${parr[a][1][b][c][0]}/${parr[a][1][b][c][1]})\n`
        }

        embed.addField(`${name} points - Page ${b} - Amount ${ (parr[a][1].length - 1)*perpage + parr[a][1][parr[a][1].length-1].length}`, links);

        embeds.push(embed);

      }
    }

  }

  return embeds;

}

function sortLuck(object){

  let arr = [];
  let keys = Object.keys(object);

  for(var a = 0; a < keys.length; a++) arr.push([keys[a], object[keys[a]]]);

  arr.sort(function(a, b){return -a[1].points + b[1].points} )

  return arr;

}
