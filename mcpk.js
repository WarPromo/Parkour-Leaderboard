
const Discord = require('discord.js'); //dependency

const client = new Discord.Client();
const fs = require("fs");
const opus = require("node-opus");


let ticketcounter = 0;

let database = JSON.parse(fs.readFileSync("points.json", "utf8"));
let maps = JSON.parse(fs.readFileSync("maps.json", "utf8"));
let collections = JSON.parse(fs.readFileSync("collections.json", "utf8"));
let adminCommands = ["m!addpoints", "m!removepoints", "m!addmap", "m!removemap", "m!createmap", "m!deletemap", "m!createcollection", "m!addcollection", "m!deletecollection"]

client.login("ODAxOTY0MTg2MzEzMjkzODM1.YAoVWQ.c0oNzb7mhvP6F-Lk71B-I-wWorE");

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag);
});

client.on("message", async (message) =>{

  let content = message.content.toUpperCase();
  let args = content.split(" ");
  let command = args[0].toLowerCase();
  let channelname = message.channel.name;

  let isstaff = false;

  if(message.guild.id == 793172726767550484){
    message.member.roles.forEach(role => {
      if(role.name == "Staff") isstaff = true;
    })
  }
  else{
    return;
  }

  for(var a = 0; a < adminCommands.length; a++){
    if(command == adminCommands[a]+"" && isstaff == false){
      let randomNumber = Math.floor( Math.random()*1001 )
      return message.channel.send("You don't have permission to do that, here's a random number from 1-1000: " + randomNumber);
    }
  }

  if(command == "m!createcollection"){

    let name = args[1];

    if(!name) return message.channel.send("Make a name for the collection");
    if(!args[2]) return message.channel.send("Tell whats in the collection");

    let collection = args[2].split(",");

    for(var a = 0; a < collection.length; a++) {
      if(collection[a] in maps == false) {
        return message.channel.send(`Invalid Map: ${collection[a]}`);
      }
    }

    if(name in collections) message.channel.send(`Replacing ${name} which is set to ${collections[name]}...`);

    collections[name] = collection;

    message.channel.send(`${name} is now set to ${collection.join(",")}`);

    fs.writeFileSync("collections.json", JSON.stringify(collections));

  }

  if(command == "m!listcollections"){
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
      embed.addField(`${collection[1][a][0]}`, `Points: ${collection[1][a][1]}\n Type: ${collection[1][a][2]}`);
    }

    let m = await message.channel.send(embed);
    await m.react("◀️");
    await m.react("▶️");

  }

  if(command == "m!deletecollection"){
    let name = args[1];

    if(name in collections == false) return message.channel.send("Collection not in database");

    delete collections[name];

    fs.writeFileSync("collections.json", JSON.stringify(collections));

    message.channel.send("Collection deleted");
  }

  if(command == "m!createplayer"){
    let player = message.mentions.members.first();

    if(!args[1]) return message.channel.send("Provide a player");
    if(!player){
      if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);
      else return message.channel.send("Invalid Player");
    }
    if(player.id in database) return message.channel.send("Player already exists");

    database[player.id] = {"regularpoints": 0, "maps": [], "name": player.user.tag};

    const exampleEmbed = new Discord.RichEmbed();

    exampleEmbed.setColor('#0099ff');
    exampleEmbed.addField('User', database[player.id]["name"]);
    exampleEmbed.addField('Total-Points', totalPoints(player.id) )
    exampleEmbed.addField(`Beaten Maps 0 / ${Object.keys(maps).length}`, `None`);
    exampleEmbed.setThumbnail(player.user.avatarURL);

    fs.writeFileSync("points.json", JSON.stringify(database) )

    return message.channel.send(exampleEmbed);
  }

  if(command == "m!map"){
    let map = args[1];
    let mapkeys = Object.keys(maps);

    if(!map) return message.channel.send("Provide a map");

    let list = [];

    for(var a = 0; a < mapkeys.length; a++){
      if(mapkeys[a].includes(map.toUpperCase() ) ) list.push(mapkeys[a]);
    }

    console.log(list);

    let embed = new Discord.RichEmbed();
    embed.addField("Map Search", map);
    for(var a = 0; a < list.length; a++){
      embed.addField(list[a], `Points: ${maps[list[a]]["amount"]} \nType: ${maps[list[a]]["type"]}`, true)
    }
    message.channel.send(embed);


  }

  if(command == "m!addcollection"){

    let collection = collections[ args[2] ];
    let player = message.mentions.members.first();
    let element = args[3];

    console.log(args[2]);

    if(!args[1]) return message.channel.send("Provide a player");
    if(!collection) return message.channel.send("Invalid Collection");
    if(!player){

      if(message.guild.members.get(args[1])+""!="undefined") player = message.guild.members.get(args[2]);
      else return message.channel.send("Invalid Player");
    }
    if(!element) return message.channel.send("Provide a map");
    if(player.id in database == false) return message.channel.send("Player not in database");

    let originalpoints = totalPoints(player.id);
    let addedCollections = "";
    let playerInfo = database[player.id];

    for(var a = 0; a < collection.length; a++){
      if(collection[a]+""==element){

        for(var b = a; b < collection.length; b++){
          if(playerInfo["maps"].indexOf(collection[b]) == -1) {
            addedCollections += `${collection[b]}: ${maps[collection[b]]["amount"]} points\n`;
            playerInfo["maps"].push(collection[b]);
          }
        }

        break;
      }
    }

    if(addedCollections.length == 0) addedCollections = "None";

    let currentpoints = totalPoints(player.id);

    addPointRoles(player, currentpoints);

    let plus = "";

    if(currentpoints > originalpoints) plus = "+"

    const exampleEmbed = new Discord.RichEmbed();
    exampleEmbed.setColor('#0099ff');
    exampleEmbed.addField('User', playerInfo["name"]);
    exampleEmbed.addField('Old-Points', originalpoints)
    exampleEmbed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
    exampleEmbed.addField('Added-Collections', addedCollections);
    exampleEmbed.setThumbnail(player.user.avatarURL);

    message.channel.send(exampleEmbed);

    fs.writeFileSync("points.json", JSON.stringify(database) )

  }

  if(command == "m!addpoints"){


    let person = message.mentions.members.first();
    let id = person.id;
    let name = person.user.tag;

    let points = parseInt(args[2]);
    let originalpoints;
    let currentpoints;

    if(!args[1]) return message.channel.send("Provide a person");
    if(!args[2] || parseInt(args[2])+"" == "NaN" ) return message.channel.send("Provide an integer point amount to add");
    if(!person){
      if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);
      else return message.channel.send("Invalid Player");
    }
    if(!person) return message.channel.send("Invalid player");
    if(person.id in database == false) return message.channel.send("Person not in database");


    originalpoints = totalPoints(id);

    database[id]["name"] = name;
    database[id]["regularpoints"] +=points;

    currentpoints = totalPoints(id);

    addPointRoles(person, currentpoints);

    let plus = "";

    if(currentpoints > originalpoints) plus = "+"

    const exampleEmbed = new Discord.RichEmbed();
    exampleEmbed.setColor('#0099ff');
    exampleEmbed.addField('User', person);
    exampleEmbed.addField('Old-Points', originalpoints)
    exampleEmbed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
    exampleEmbed.setThumbnail(person.user.avatarURL);

    message.channel.send(exampleEmbed);

    fs.writeFileSync("points.json", JSON.stringify(database) )

  }

  if(command == "m!createmap"){


    let map = args[1];
    let points = parseInt(args[2]);
    let type = args[3];

    console.log(points);

    if(!map) return message.channel.send("Provide a map to set the points to");

    if(!args[2] || parseInt(args[2])+"" == "NaN") return message.channel.send("Provide an integer point amount");

    if(!type) return message.channel.send("Please set a type");

    if(map in maps) message.channel.send(`Changing ${map} which is set to ${maps[map]} points`)
    maps[map] = {amount: points, type: type};

    message.channel.send(`${map} is now set to ${points} points`);

    fs.writeFileSync("maps.json", JSON.stringify(maps) );

  }

  if(command == "m!removepoints"){


    let person = message.mentions.members.first();
    let id = person.id;
    let name = person.user.tag;

    let points = parseInt(args[2]);
    let originalpoints;
    let currentpoints;

    if(!args[1]) return message.channel.send("Provide a person");
    if(!args[2] || parseInt(args[2])+"" == "NaN" ) return message.channel.send("Provide an integer point amount to add");
    if(!person){
      if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);
      else return message.channel.send("Invalid Player");
    }
    if(!message.mentions.members.first() ) person = message.guild.members[args[1]];
    if(!person) return message.channel.send("Invalid player");
    if(person.id in database == false) return message.channel.send("Person not in database");


    originalpoints = totalPoints(id);

    database[id]["name"] = name;
    database[id]["regularpoints"]-=points;

    currentpoints = totalPoints(id);

    addPointRoles(person, currentpoints);

    let plus = "";

    if(currentpoints > originalpoints) plus = "+"

    const exampleEmbed = new Discord.RichEmbed();
    exampleEmbed.setColor('#0099ff');
    exampleEmbed.addField('User', person);
    exampleEmbed.addField('Old-Points', originalpoints)
    exampleEmbed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
    exampleEmbed.setThumbnail(person.user.avatarURL);

    message.channel.send(exampleEmbed);

    fs.writeFileSync("points.json", JSON.stringify(database) )
  }

  if(command == "m!deletemap"){


    let map = args[1];

    if(!map) return message.channel.send("Provide a map to remove");
    if(map in maps == false) return message.channel.send("Map not in database");

    let originalpoints = maps[map]["amount"];

    delete maps[map];

    message.channel.send(`Deleted ${map} which was set to ${originalpoints} points`);

    fs.writeFileSync("maps.json", JSON.stringify(maps) );
  }

  if(command == "m!addmap"){

    let person = message.mentions.members.first();

    if(!person) return message.channel.send("Provide a person");

    let map = args[2];

    console.log(map);

    if(!map) return message.channel.send("Provide a map");
    if(!args[1]) return message.channel.send("Provide a person");
    if(map in maps == false) return message.channel.send("Map not in database");
    if(!person){
      if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);
      else return message.channel.send("Invalid Player");
    }
    if(person.id in database == false) return message.channel.send("Player not in database");
    if(database[person.id]["maps"].indexOf(map) != -1 ) return message.channel.send("Player already beat that map");

    let originalpoints = totalPoints(person.id);
    database[person.id]["maps"].push(map);
    let currentpoints = totalPoints(person.id);

    addPointRoles(person, currentpoints);

    let plus = "";

    if(currentpoints > originalpoints) plus = "+"

    const exampleEmbed = new Discord.RichEmbed();
    exampleEmbed.setColor('#0099ff');
    exampleEmbed.addField('User', person);
    exampleEmbed.addField('Old-Points', originalpoints)
    exampleEmbed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
    exampleEmbed.setThumbnail(person.user.avatarURL);

    message.channel.send(exampleEmbed);

    fs.writeFileSync("points.json", JSON.stringify(database) )

  }

  if(command == "m!removemap"){

    let person = message.mentions.members.first();
    let map = args[2];

    console.log(map);

    if(!map) return message.channel.send("Provide a map");
    if(map in maps == false) return message.channel.send("Map not in database");

    if(!args[1]) return message.channel.send("Provide a person");
    if(!person){
      if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);
      else return message.channel.send("Invalid Player");
    }
    if(person.id in database == false) return message.channel.send("Player not in database");
    if(database[person.id]["maps"].indexOf(map) == -1 ) return message.channel.send("Player hasn't beaten that map");

    let originalpoints = totalPoints(person.id);
    let arr = database[person.id]["maps"];
    let newarr = [];

    for(var a = 0; a < arr.length; a++) if(arr[a]+""!=map) newarr.push(arr[a]);

    database[person.id]["maps"] = newarr;

    let currentpoints = totalPoints(person.id);

    addPointRoles(person, currentpoints);

    let plus = "";

    if(currentpoints > originalpoints) plus = "+"

    const exampleEmbed = new Discord.RichEmbed();
    exampleEmbed.setColor('#0099ff');
    exampleEmbed.addField('User', person);
    exampleEmbed.addField('Old-Points', originalpoints)
    exampleEmbed.addField('Current-Points', currentpoints + ` ( ${plus}${currentpoints - originalpoints} )`);
    exampleEmbed.setThumbnail(person.user.avatarURL);

    message.channel.send(exampleEmbed);

    fs.writeFileSync("points.json", JSON.stringify(database) )

  }

  if(command == "m!profile" || command == "m!p"){

    let person = message.mentions.members.first();
    let mapArray = [];
    let mapKeys;

    if(!args[1]) return message.channel.send("Please provide a person");
    if(!person){
      if(message.guild.members.get(args[1])+""!="undefined") person = message.guild.members.get(args[1]);
      else return message.channel.send("Please provide a person");
    }

    if(person.id in database == false){
      database[person.id] = {"regularpoints": 0, "maps": [], "name": person.user.tag};
    }

    mapKeys = database[person.id]["maps"];

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

    console.log(mapArray);

    const exampleEmbed = new Discord.RichEmbed();

    exampleEmbed.setColor('#0099ff');
    exampleEmbed.addField('User', database[person.id]["name"]);
    exampleEmbed.addField('Total-Points', totalPoints(person.id) )

    for(var a = 0; a < mapArray.length; a++){
      let mapString = "";
      mapArray[a][1].sort( function(a,b){ return -a[1] + b[1] } );
      for(var b = 0; b < mapArray[a][1].length || b < 10; b++){
        mapString += `${mapArray[a][1][b][0]}: ${mapArray[a][1][b][1]} points\n`;
      }
      exampleEmbed.addField(mapArray[a][0], mapString, true);
    }


    exampleEmbed.setThumbnail(person.user.avatarURL);

    message.channel.send(exampleEmbed);

  }

  if(command == "m!listmaps"){


    let arr = objectArray(maps);

    if(args[1]) arr = arr.filter(element => element[2]+"" == args[1]+"");

    let filter="";

    if(args[1]) filter = args[1];

    const embed = new Discord.RichEmbed();
    embed.addField("Maps", `Page 0 ${filter}`);

    for(var a = 0; a < arr.length && a < 9; a++){
      embed.addField(`${arr[a][0]}`, `Points: ${arr[a][1]}\nType: ${arr[a][2]}`, true)
    }

    message.channel.send(embed).then(async m => {
      await m.react("◀️");
      await m.react("▶️");
    });

  }

  if(command == "m!help"){
    let string = "```";
    message.channel.send(`
${string}
m!createticket : Create a channel that only you, and staff can see

m!profile <@user> <amount> : View the profile of a player

m!addpoints <@user> <amount> : Add points or a map to a player

m!removepoints <@user> <amount> : Remove points or a map from a player

m!createmap <name> <worth> <type> : Set a map to a certain amount of points

m!addmap <name> <map> : Add a map to a user to signify that they beat it

m!deletemap <name> : Remove a map from the database

m!leaderboard <type> (type=all to see normal leaderboard): List the leaderboard of players with a type

m!listmaps <filter> (optional to put filter): List all the maps

m!createcollection <CollectionName> <Collection> : Create a collection

m!addcollection <CollectionName> <User> <Part> : Add the ranks to the user, in this situation the user would get IX and everything below

m!deletecollection <CollectionName> : Remove a Collection

m!listcollections : List collections

m!map <keyword> : Search for map names with a keyword
${string}
      `)
  }

  if(command == "m!createticket"){

    let category;



    message.guild.channels.forEach(channel => {
      if(channel.name == "claim-points"){
        category = channel.parent;
      }
    });

    let channel = await message.guild.createChannel(`Ticket ${ticketcounter} User ${message.author.tag}`);
    channel.setParent(category);
    let everyoneRole;
    let staffRole;

    message.guild.roles.forEach(role => {
      if(role.name == "@everyone") everyoneRole = role;
    })

    message.guild.roles.forEach(role => {
      if(role.name == "Staff") staffRole = role;
    })

    channel.overwritePermissions(client.user, {
      VIEW_CHANNEL: true
    })

    channel.overwritePermissions(message.author, {
      VIEW_CHANNEL: true
    })

    channel.overwritePermissions(staffRole, {
      VIEW_CHANNEL: true
    })

    channel.overwritePermissions(everyoneRole, {
      VIEW_CHANNEL: false
    })

    ticketcounter++;

    message.delete();

  }

  if(command == "m!leaderboard"){
    let leaderboard = [];
    let keys = Object.keys(database);
    let type = args[1];

    if(!args[1]) type = "ALL";


    for(var a = 0; a < keys.length; a++){

      let name = database[keys[a]]["name"];

      if(type != "ALL") leaderboard.push([ name, totalPointsType(keys[a], type) ]);
      else leaderboard.push([ name, totalPoints(keys[a], type) ]);

    }

    console.log(leaderboard);

    leaderboard.sort(function(a, b){return -a[1] + b[1]});

    const exampleEmbed = new Discord.RichEmbed();
    exampleEmbed.setColor('#0099ff');

    let players = "";

    for(var a = 0; a < leaderboard.length; a++){
      players += `${a + 1}. ${leaderboard[a][0]}: ${leaderboard[a][1]} points \n`;
    }

    exampleEmbed.addField("Leaderboard-" + type, players);

    message.channel.send(exampleEmbed);

  }


});

client.on("messageReactionAdd", async (messageReaction, user) => {


  let message = messageReaction.message;




  if(message.author != client.user || user == client.user || message.embeds.length == 0) return;

  let embed = message.embeds[0].fields[0].name;


  let args = message.content.split(" ");
  console.log(args);

  if(embed == "Maps"){

    let arr = objectArray(maps);
    let page = parseInt(message.embeds[0].fields[0].value.split(" ")[1]);
    let filter = "";

    if(message.embeds[0].fields[0].value.split(" ")[2]){

      console.log("There is a filter");

      filter = message.embeds[0].fields[0].value.split(" ")[2];
      arr = arr.filter(element => element[2]+"" == filter);

    }

    if(messageReaction.emoji.name == "▶️") page++;
    else if(messageReaction.emoji.name == "◀️") page--;
    else return;

    if(page < 0) page = 0;
    if(page * 10 > arr.length-1) page = Math.floor( (arr.length - 1) / 10);

    const embed = new Discord.RichEmbed();
    embed.addField("Maps", `Page ${page} ${filter}`);

    for(var a = page * 10; a < arr.length && a < page*10 + 9; a++){
      embed.addField(`${arr[a][0]}`, `Points: ${arr[a][1]}\nType: ${arr[a][2]}`, true)
    }


    //embed.addField("Map Info", `Map: ${arr[page][0]}\n Points: ${arr[page][1]}\nType: ${arr[page][2]}`)

    message.edit(embed);
    messageReaction.remove(user);

  }

  if(embed == "Collections"){

    let page = parseInt(message.embeds[0].fields[0].value.split(" ")[1]);
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

    console.log(arr);

    if(messageReaction.emoji.name == "▶️") page++;
    else if(messageReaction.emoji.name == "◀️") page--;
    else return;

    if(page < 0) page = 0;
    if(page > arr.length - 1) page = arr.length - 1;

    let collection = arr[page];
    let embed = new Discord.RichEmbed();

    embed.addField("Collections", `Page ${page}`);

    embed.addField("Collection: ", collection[0]);

    for(var a = 0; a < collection[1].length; a++){
      embed.addField(`${collection[1][a][0]}`, `Points: ${collection[1][a][1]}\n Type: ${collection[1][a][2]}`);
    }

    message.edit(embed);
    messageReaction.remove(user);

  }
});




function objectArray(object){

  let arr = [];
  let keys = Object.keys(object);

  for(var a = 0; a < keys.length; a++){
    arr.push([ keys[a], object[ keys[a] ]["amount"], object[ keys[a] ]["type"] ]);
  }

  console.log(arr);

  return arr;

}

function sortObject(object){

  let arr = [];
  let keys = Object.keys(object);

  for(var a = 0; a < keys.length; a++) arr.push([keys[a], object[keys[a]]]);

  arr.sort(function(a, b){return -a[1] + b[1]} )

  return arr;

}

function addPointRoles(person, currentpoints){
  let theirrole;

  person.roles.forEach(role => {
    if(role.name.startsWith("|")){
      theirrole = role;
    }
  })

  let bestrole;
  let bestroleNumber = -1;

  person.guild.roles.forEach(role => {
    if(role.name.startsWith("|")){
      let number = parseInt(role.name.split(" ")[1]);
      if(currentpoints >= number && number >= bestroleNumber){
        bestrole = role;
        bestroleNumber = number;
      }
    }
  });

  console.log(theirrole.name);
  console.log(bestrole.name);

  if(bestrole.name != theirrole.name){
    console.log("Role needs to be removed");
    if(bestrole){
      person.addRole(bestrole).then(() => {
        person.removeRole(theirrole);
      });
    }
  }

}

function totalPoints(person){
  let points = 0;

  let arr = database[person]["maps"];
  let correctarr = [];

  points += database[person]["regularpoints"];

  for(var a = 0; a < arr.length; a++){

    if(arr[a] in maps) {
      points += maps[arr[a]]["amount"];
      correctarr.push(arr[a]);
    }

  }

  database[person]["maps"] = correctarr;

  return points;
}

function totalPointsType(person, type){
  let points = 0;

  let arr = database[person]["maps"];
  let correctarr = [];

  for(var a = 0; a < arr.length; a++){
    if(arr[a] in maps) {
      if(maps[arr[a]]["type"] == type){
        points += maps[arr[a]]["amount"];
      }
      correctarr.push(arr[a]);
    }
  }

  database[person]["maps"] = correctarr;

  return points;
}
