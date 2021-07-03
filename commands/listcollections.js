if(command == "m!listcollections"){

  let pageNumber = 0;

  let filter = "None";

  if(args[1]) filter = args[1];

  console.log(filter);

  let array = createCollectionArray(filter);

  if(array.length == 0) return message.channel.send(`0 results found`)

  let embed = collectionEmbed(0, array, filter);


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

    let currentArray = createCollectionArray(filter);
    let embed;
    let user = element.users.last();

    console.log(Object.keys(element));

    if(element._emoji.name == "▶️") pageNumber++;
    if(element._emoji.name == "◀️") pageNumber--;

    if(pageNumber < 0) pageNumber = 0;
    if(pageNumber > currentArray.length-1) pageNumber = currentArray.length-1;

    embed = collectionEmbed(pageNumber, currentArray, filter);

    embedMessage.edit( embed );
    element.remove( user );

  })



}

function createCollectionArray(filter="None"){

  let arr = [];
  let keys = Object.keys(collections);

  console.log(filter);

  for(var a = 0; a < keys.length; a++){

    console.log(filter);

    if(keys[a].includes(filter) == false && filter != "None") continue;

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


function collectionEmbed(page, arr, filter){

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

  console.log("Got here")

  embed.addField("Collections", `Page ${page}\nFilter: ${filter}`);
  embed.addField("Collection: ", collection[0]);

  console.log("Got here2")

  for(var a = 0; a < collection[1].length; a++){
    embed.addField(`${collection[1][a][0]}`, `Points: ${collection[1][a][1]}\n Type: ${collection[1][a][2]}`, true);
  }

  return embed;

}
