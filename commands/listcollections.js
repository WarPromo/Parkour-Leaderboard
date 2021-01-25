if(command == "m!listcollections"){

  let pageNumber = 0;

  let array = createCollectionArray();
  let embed = collectionEmbed(0, array);

  let embedMessage = await message.channel.send(embed);

  function reactionFilter(reaction, user){
    if(user == client.user) return false;
    if(reaction.emoji.name == "▶️" || reaction.emoji.name == "◀️") return true;
    else return false;
  }

  await embedMessage.react("◀️");
  await embedMessage.react("▶️");

  let collector = embedMessage.createReactionCollector(reactionFilter, { time: 120000 })

  collector.on("collect", async (element, collector) => {

    let currentArray = createCollectionArray();
    let embed;
    let user = element.users.last();

    console.log(Object.keys(element));

    if(element._emoji.name == "▶️") pageNumber++;
    if(element._emoji.name == "◀️") pageNumber--;

    if(pageNumber < 0) pageNumber = 0;
    if(pageNumber > currentArray.length-1) pageNumber = currentArray.length-1;

    embed = collectionEmbed(pageNumber, currentArray);

    embedMessage.edit( embed );
    element.remove( user );

  })



}

function createCollectionArray(){

  let arr = [];
  let keys = Object.keys(collections);

  for(var a = 0; a < keys.length; a++){

    let arr2 = [keys[a]];
    let arr3 = [];
    let cArr = collections[keys[a]];

    for(var b = 0; b < cArr.length; b++){
      let map = maps[cArr[b]]
      if(!map) continue;
      arr3.push([ cArr[b], map["amount"], map["type"] ]);
    }

    arr2.push(arr3);
    arr.push(arr2);

  }

  return arr;

}


function collectionEmbed(page, arr){

  let embed = new Discord.RichEmbed();

  /*
  arr =
  [

    [ "CollectionName1", [ ["Mapname", "points"], ["Mapname", "points"] ],
    [ "CollectionName2", [ ["Mapname", "points"], ["Mapname", "points"] ]
    [ "CollectionName3", [ ["Mapname", "points"], ["Mapname", "points"] ]

  ]
  */

  collection = arr[page];

  embed.addField("Collections", `Page ${page}`);
  embed.addField("Collection: ", collection[0]);

  for(var a = 0; a < collection[1].length; a++){
    embed.addField(`${collection[1][a][0]}`, `Points: ${collection[1][a][1]}\n Type: ${collection[1][a][2]}`, true);
  }

  return embed;

}
