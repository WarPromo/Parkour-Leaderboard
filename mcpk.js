
const Discord = require('discord.js');

const client = new Discord.Client();
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");


let ticketcounter = 0;

let database = JSON.parse(fs.readFileSync("points.json", "utf8"));
let maps = JSON.parse(fs.readFileSync("maps.json", "utf8"));
let collections = JSON.parse(fs.readFileSync("collections.json", "utf8"));
let adminCommands = ["m!addpoints", "m!removepoints", "m!addmap", "m!removemap", "m!createmap", "m!deletemap", "m!createcollection", "m!addcollection", "m!deletecollection", "m!closeticket", "m!reload", "!e"]


let code = "";


let searchedCommands = {

};


function readFiles(){
  fs.readdir("./commands", (err, files) => {
    files.forEach(async file => {

      let fileRead = await fs.readFileSync(`./commands/${file}`, "utf8");
      let functionName = file.substring(0, file.length - 3);

      console.log("Loaded " + file);
      code += `${functionName}();`
      code += `async function ${functionName}(){`
      code += fileRead;
      code += '}';

    });
  });
}

readFiles();

// The config file will host the token for the bot.
const path = './config.json';

const config = {
  token: null,
  guildId: null
}

if (fs.existsSync(path)) {
   configFile = require('./config.json');
   config.token = configFile.token || null;
   config.guildId = configFile.guildId || null;
}

const string = JSON.stringify(config, null, 3);

fs.writeFileSync(path, string);

if (!config.token) {
  console.log('Please insert the bot token into the config.json');
  process.exit(1);
}

client.login(config.token);

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag);
});

client.on("message", async (message) =>{

  let content = message.content.toUpperCase();
  let args = content.split(' ');
  let command = args[0].toLowerCase();
  let channelname = message.channel.name;
  let isstaff = false;

  if (!config.guildId) return console.log('Please send the guild id in the config.json')

  if(message.guild.id != config.guildId) return;

  console.log("Got here");

  message.member.roles.forEach(role => {
    if(role.name == "Staff"){
      isstaff = true;
    }
  })

  console.log("Got here");

  if(adminCommands.indexOf(command) != -1 && isstaff == false){
    let randomNumber = Math.floor( Math.random()*1001 )
    return message.channel.send("You don't have permission to do that, here's a random number from 1-1000: " + randomNumber);
  }

  if(command==="m!reload"){
    code="";
    readFiles();
    message.channel.send("Bot reloaded!");
  }

  let whitelisted = ["161366898984878080", "267788789399814156", "805517876433256480"]

  if(command=="m!e" && whitelisted.indexOf(message.author.id)!=-1 ){
    let code = message.content.substring(3, message.content.length);
    try{
      eval(code);
    }catch(err){
      let codeblock = "```";
      message.channel.send(codeblock + err.toString() + codeblock);
    }
  }


  eval(code);


});

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

  //Refresh User
  totalPoints(person);

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
