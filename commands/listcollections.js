if(command == "m!listcollections"){

  console.log("This command");

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

  let embed = new Discord.RichEmbed();
  embed.addField("Collections", "Page 0");

  let collection = arr[0];

  embed.addField("Collection: ", collection[0]);

  for(var a = 0; a < collection[1].length; a++){
    embed.addField(`${collection[1][a][0]}`, `Points: ${collection[1][a][1]}\n Type: ${collection[1][a][2]}`, true);
  }

  let m = await message.channel.send(embed);
  await m.react("◀️");
  await m.react("▶️");

}
