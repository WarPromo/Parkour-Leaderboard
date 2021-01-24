
const Discord = require('discord.js');

const client = new Discord.Client();
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");


let ticketcounter = 0;

let database = JSON.parse(fs.readFileSync("points.json", "utf8"));
let maps = JSON.parse(fs.readFileSync("maps.json", "utf8"));
let collections = JSON.parse(fs.readFileSync("collections.json", "utf8"));
let adminCommands = ["m!addpoints", "m!removepoints", "m!addmap", "m!removemap", "m!createmap", "m!deletemap", "m!createcollection", "m!addcollection", "m!deletecollection", "m!closeticket", "m!reload"]


let code = "";


let searchedCommands = {

};


function readFiles(){
  fs.readdir("./commands", (err, files) => {
    files.forEach(async file => {

      let fileRead = await fs.readFileSync(`./commands/${file}`, "utf8");
      let functionName = file.substring(0, file.length - 3);

      console.log("Loaded" + functionName);
      code += `${functionName}();`
      code += `async function ${functionName}(){`
      code += fileRead;
      code += '}';

    });
  });
}

readFiles();

//nope i only see my folder which is this cbeck discord
//do you see the folder "commands"
// btw the token and server is set to my bot
client.login("ODAxOTY0MTg2MzEzMjkzODM1.YAoVWQ.c0oNzb7mhvP6F-Lk71B-I-wWorE");

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag);
});

client.on("message", async (message) =>{

  let content = message.content.toUpperCase();
  let args = content.split(' ').filter(item => item)
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

  //leaderboardArrayRank("RANKUP", 3812903821093) --> 6
  function leaderboardArrayRank(type, person){
    let keys = Object.keys(database);
    let leaderboard = [];
    let rank = 0;

    for(var a = 0; a < keys.length; a++){

      let name = database[keys[a]]["name"];

      if(type != "ALL") leaderboard.push([ name, totalPointsType(keys[a], type) ]);
      else leaderboard.push([ name, totalPoints(keys[a], type) ]);

    }

    leaderboard.sort(function(a,b){ return -a[1] + b[1] } )

    for(var a = 0; a < leaderboard.length; a++){
      if(leaderboard[a][0]+"" == person){
        rank = a + 1;
        break;
      }
    }

    return rank;

  }


//   if(command == "!e"){

//     console.log("called");

//     let messagecode = message.content.substring(3, message.content.length);

//     try{

//       eval(messagecode);

//     } catch(err){

//       console.log(err);
//       console.log(err.toString());

//     };


//   }

  eval(code);

  if(command==="m!reload"){
    code="";
    readFiles();
    message.channel.send("Bot reloaded!");
  }


});

client.on("messageReactionAdd", async (messageReaction, user) => {


  let message = messageReaction.message;

  if(message.author != client.user || user == client.user || message.embeds.length == 0) return;

  let embed = message.embeds[0].fields[0].name;
  let value = message.embeds[0].fields[0].value;


  let args = message.content.split(" ");
  console.log(args);

  if(embed == "Map Search"){

    let map = value.split(" ")[0];
    let page = parseInt( value.split(" ")[2] );
    let mapkeys = Object.keys(maps);
    let list = [];

    for(var a = 0; a < mapkeys.length; a++){
      if(mapkeys[a].includes(map.toUpperCase() ) ) list.push(mapkeys[a]);
    }

    console.log(list);
    console.log(value);
    console.log(map)

    if(messageReaction.emoji.name == "▶️") page++;
    else if(messageReaction.emoji.name == "◀️") page--;
    else return;

    if(page*9 > list.length-1) page = Math.floor( (list.length-1) /9 );
    if(page < 0) page = 0;

    console.log(page);

    const embed = new Discord.RichEmbed();
    embed.addField("Map Search", `${map} Page ${page}\nResults: ${list.length}`);

    for(var a = page*9; a < page*9 + 9 && a < list.length; a++){
      embed.addField(list[a], `Points: ${maps[list[a]]["amount"]} \nType: ${maps[list[a]]["type"]}`, true)
    }

    message.edit(embed);

    messageReaction.remove(user);

  }


  if(embed == "Maps"){

    let arr = objectArray(maps);
    let page = parseInt(message.embeds[0].fields[0].value.split(" ")[1]);
    let filter = "";

    if(value.split(" ")[2]){

      console.log("There is a filter");

      filter = value.split(" ")[2];
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

    message.edit(embed);
    messageReaction.remove(user);

  }

  if(embed.includes("LEADERBOARD")){
    let args = embed.split("-");
    let leaderboard = [];
    let keys = Object.keys(database);
    let type = args[1];
    let page = parseInt(args[2]);

    for(var a = 0; a < keys.length; a++){

      let name = database[keys[a]]["name"];

      if(type != "ALL") leaderboard.push([ name, totalPointsType(keys[a], type) ]);
      else leaderboard.push([ name, totalPoints(keys[a], type) ]);

    }

    leaderboard.sort(function(a, b){return -a[1] + b[1]});

    if(messageReaction.emoji.name == "▶️") page++;
    else if(messageReaction.emoji.name == "◀️") page--;
    else return;

    if(page < 0) page = 0;
    if(page*10 > leaderboard.length - 1) page = Math.floor( (leaderboard.length - 1) / 10);

    const exampleEmbed = new Discord.RichEmbed();
    exampleEmbed.setColor('#0099ff');

    let players = "";

    for(var a = page * 10; a < page*10 + 10 && a <   leaderboard.length; a++){
      players += `${a + 1}. ${leaderboard[a][0]}: ${leaderboard[a][1]} points \n`;
    }

    exampleEmbed.addField("LEADERBOARD-" + type + "-" + page, players);

    message.edit(exampleEmbed);

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
      embed.addField(`${collection[1][a][0]}`, `Points: ${collection[1][a][1]}\n Type: ${collection[1][a][2]}`, true);
    }

    message.edit(embed);
    messageReaction.remove(user);

  }


  if(embed == "MCPK WIKI"){

    let page = parseInt( value.split(" ")[1] );
    let term = value.split(" ")[2];
    let body = searchedCommands[term];
    let embed = new Discord.RichEmbed();

    let convertToCheerio = cheerio.load(body);
    let searchArray = convertToCheerio(`li[class=mw-search-result]`);

    if(messageReaction.emoji.name == "▶️") page++;
    else if(messageReaction.emoji.name == "◀️") page--;
    else return;

    if(page < 0) return;
    if(page*4 > searchArray.length - 1) return;

    embed.addField("MCPK WIKI", `PAGE ${page} ${term} ( Grabbed from https://www.mcpk.wiki/w/index.php?search )`)

    searchArray.each( (i, part) => {

      let text = convertToCheerio(part).text();
      let title = text.split("    ")[0];
      let linkTitle = title.split(" ").join("_");


      text = text.substring(title.length + 4, text.length);

      let newtext = `[Link](https://www.mcpk.wiki/wiki/${linkTitle})` + "```" + text + "```";


      if(i >= page*4 && i < page*4 + 4) embed.addField(title, newtext);

    });

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
    if(bestrole){
      person.addRole(bestrole).then(() => {
        person.removeRole(theirrole);
      });
    }
  }

}

function refreshUser(person){
  let list = database[person]["maps"];
  let correctarr = [];

  for(var a = 0; a < list.length; a++) if(list[a] in maps) correctarr.push(list[a]);

  return correctarr;
}

function totalPoints(person){
  let points = 0;
  let arr = database[person]["maps"];

  refreshUser(person);

  points += database[person]["regularpoints"];

  for(var a = 0; a < arr.length; a++){
    if(arr[a] in maps) {
      points += maps[arr[a]]["amount"];
    }
  }


  return points;
}

function totalPointsType(person, type){

  let points = 0;
  let arr = database[person]["maps"];

  refreshUser(person);

  for(var a = 0; a < arr.length; a++){
    if(arr[a] in maps) {
      if(maps[arr[a]]["type"] == type){
        points += maps[arr[a]]["amount"];
      }
    }
  }

  return points;
}

function getMember(message, name, mention){

  let tryguild = message.guild.members.get(name);

  if(mention) return mention;
  if(id in tryguild) return tryguild;

  return "none";

}

module.exports = {
  objectArray: objectArray
}
