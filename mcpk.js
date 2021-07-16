
const Discord = require('discord.js');

const client = new Discord.Client();
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");

require('discord-buttons')(client)

console.log(replyInteraction)

const { DiscordInteractions } = require("slash-commands");
const { ApplicationCommandOptionType } = require("slash-commands");
const fetch = require("node-fetch")




let ticketcounter = 0;

let database = JSON.parse(fs.readFileSync("points.json", "utf8"));
let maps = JSON.parse(fs.readFileSync("maps.json", "utf8"));
let collections = JSON.parse(fs.readFileSync("collections.json", "utf8"));
let luckydb = JSON.parse( fs.readFileSync("luckyclover.json", "utf8") )
let mathdb = JSON.parse( fs.readFileSync("mathleaderboard.json", "utf8") )
let adminCommands = [ "m!removepoints", "m!addmap", "m!removemap", "m!createmap", "m!deletemap", "m!createcollection", "m!addcollection", "m!deletecollection", "m!reload", "!e", "m!renamemap", "m!addword", "m!deleteword"]

let currentTickets = {}
let currentMaths = {}


let fortyfives = {}


function readFiles(dir, callback){

  let code = ""

  fs.readdir("./"+dir, async (err, files) => {
    await files.forEach(async file => {

      console.log(file)

      let fileRead = await fs.readFileSync(`./${dir}/${file}`, "utf8");
      let functionName = file.substring(0, file.length - 3);

      code += `${functionName}();`
      code += `async function ${functionName}(){`
      code += fileRead;
      code += '}';



    })

    callback(code)

  });

}

let code;
let slashcode;

readFiles("commands", (c) => code = c);
readFiles("slashcommands", (c) => slashcode = c);

// The config file will host the token for the bot.
const path = './config.json';

const config = require('./config.json')

console.log(config);

//CREATE SLASH COMMANDS
const interaction = new DiscordInteractions({
  applicationId: config.appid,
  authToken: config.token,
  publicKey: config.publickey
});

const addpoints = {
  name: "addpoints",
  description: "add points to a user",
  options: [
    {
      name: "user",
      description: "which user should recieve points",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    },
    {
      name: "amount",
      description: "amount of points",
      type: ApplicationCommandOptionType.INTEGER,
      required: "true"

    }
  ],
};

const removepoints = {
  name: "removepoints",
  description: "removepoints from a user",
  options: [
    {
      name: "user",
      description: "which user should recieve points",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    },
    {
      name: "amount",
      description: "amount of points",
      type: ApplicationCommandOptionType.INTEGER,
      required: "true"

    }
  ],
};

const addmap = {
  name: "addmap",
  description: "addmap to a user",
  options: [
    {
      name: "user",
      description: "which user should recieve map",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    },
    {

      name: "map",
      description: "the map",
      required: "true",
      type: ApplicationCommandOptionType.STRING,
      //choices: choices

    }
  ],
};

const removemap = {
  name: "removemap",
  description: "removemap from a user",
  options: [
    {
      name: "user",
      description: "which user should lose map",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    },
    {
      name: "map",
      description: "the map",
      required: "true",
      type: ApplicationCommandOptionType.STRING,
      //choices: choices

    }
  ],
};

const addmaps = {
  name: "addmaps",
  description: "addmaps to a user each map you want to add is seperated by a space",
  options: [
    {
      name: "user",
      description: "which user should recieve map",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    },
    {

      name: "map",
      description: "the map",
      required: "true",
      type: ApplicationCommandOptionType.STRING,
      //choices: choices

    }
  ],
};

const addcollection = {
  name: "addcollection",
  description: " add collection ",
  options: [
    {
      name: "user",
      description: "which user should lose map",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    },
    {
      name: "collection",
      description: "the collection",
      required: "true",
      type: ApplicationCommandOptionType.STRING,
      //choices: choices

    },
    {
      name: "map",
      description: "the map",
      required: "true",
      type: ApplicationCommandOptionType.STRING,
      //choices: choices

    }
  ],
};

const luckyp = {
  name: "luckyp",
  description: "lucky profile",
  options: [
    {
      name: "user",
      description: "see the lucky profile of a user",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    }
  ],
};


const profile = {
  name: "profile",
  description: "player profile",
  options: [
    {
      name: "user",
      description: "see the profile of a user",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    }
  ],
};

const incompletemaps = {
  name: "incompletemaps",
  description: "see the incompleted maps of a user",
  options: [
    {
      name: "user",
      description: "see the profile of a user",
      type: ApplicationCommandOptionType.USER,
      required: "true"
    }
  ],
};

interaction.createApplicationCommand(addpoints, config.guildId)
interaction.createApplicationCommand(removepoints, config.guildId)
interaction.createApplicationCommand(addmap, config.guildId)
interaction.createApplicationCommand(removemap, config.guildId)
interaction.createApplicationCommand(addcollection, config.guildId)
interaction.createApplicationCommand(addmaps, config.guildId)
interaction.createApplicationCommand(luckyp, config.guildId)
interaction.createApplicationCommand(profile, config.guildId)
interaction.createApplicationCommand(incompletemaps, config.guildId)

client.login(config.token);

let usercommands = ["profile", "incompletemaps", "luckyp"];


client.ws.on('INTERACTION_CREATE', async interaction => {

  let args = [ interaction.data.name ];

  for(o in interaction.data.options){
    if(interaction.data.options[o].value.toUpperCase){
      args.push(interaction.data.options[o].value.toUpperCase());
    }
    else{
      args.push(interaction.data.options[o].value);
    }

  }

  if(!args[0]) return;

  let command = args[0].toLowerCase();

  console.log(command)

  let guild = client.guilds.cache.get(config.guildId);

  //console.log(args);

  let sender = await guild.members.fetch(args[1])
  let creator = await guild.members.fetch(interaction.member.user.id);

  let isstaff = false;

  creator.roles.cache.forEach(role => {
    if(role.name == "Staff"){
      isstaff = true;
    }
  })



  if(!isstaff && usercommands.indexOf(command)==-1){
    console.log(command);
    let n = Math.floor(Math.random()*100000)


    return replyInteraction(interaction.id, interaction.token, "", "You aren't a staff member (Here's a random number between 1 and 100000: " + n + " )");
  }

  //console.log(sender);

  console.log(command)

  eval(slashcode);

})

client.on('ready', () => {

  console.log("Logged in as " + client.user.tag);

});

client.on("clickButton", async (button) => {

  console.log("Clicked")

  if(button.id == "createTicket"){

    let embed = new Discord.MessageEmbed()
    await button.clicker.fetch();

    if(button.clicker.user == null){
      embed.addField('Interaction Failed', "User is null");
    }
    else if(button.clicker.user.id in currentTickets){
      embed.addField('Ticket not created', "You've already made a ticket");
    }
    else{
      createTicket(button.clicker.user, button.message)
      currentTickets[button.clicker.user.id] = true;
      embed.addField('Ticket created!', 'Type m!closeticket to close your ticket.')
    }

    return button.reply.send({ embed: embed, ephemeral: true });
  }

})

client.on("message", async (message) =>{

  let content = message.content.toUpperCase();
  let args = content.split(' ');
  let command = args[0].toLowerCase();
  let channelname = message.channel.name;
  let isstaff = false;

  console.log(message.components)

  if (!config.guildId) return console.log('Please send the guild id in the config.json')

  if(message.guild.id != config.guildId) return;

  if(message.member == null) return;

  message.member.roles.cache.forEach(role => {
    if(role.name == "Staff"){
      isstaff = true;
    }
  })

  if(adminCommands.indexOf(command) != -1 && isstaff == false){
    let randomNumber = Math.floor( Math.random()*1001 )
    return message.channel.send("You don't have permission to do that, here's a random number from 1-1000: " + randomNumber);
  }

  if(command==="m!reload"){

    readFiles("commands", (c) => code = c);
    readFiles("slashcommands", (c) => slashcode = c);

    message.channel.send("Bot reloaded!");

  }

  let whitelisted = ["161366898984878080", "690411446340943882", "805517876433256480"]

  if(command=="m!e" && whitelisted.indexOf(message.author.id)!=-1 ){
    let code = `e(); async function e(){ ${message.content.substring(3, message.content.length)} }`;
    try{
      eval(code);
    }catch(err){
      let codeblock = "```";
      message.channel.send(codeblock + err.toString() + codeblock);
    }
  }


  eval(code);


});

//FUNCTIONS--------------------------------------------------------------------














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

let roleevents = []


setInterval(doEvent, 6000)

async function doEvent(){

  if(roleevents.length != 0 ){

    let r = roleevents[0]

    if(r[2]+"" == "Remove"){

      if( r[0].roles.cache.has(r[1].id) == true ) r[0].roles.remove(r[1])
      else{
        roleevents.shift()
        doEvent();
        return;
      }
      roleevents.shift()

    }
    else{

      if( r[0].roles.cache.has(r[1].id) == false ) r[0].roles.add( r[1], "Updating point roles")
      else{

        roleevents.shift()
        doEvent();
        return;
      }
      roleevents.shift()

    }



  }

}

async function addPointRoles(person, currentpoints){

    let roleArray = [];
    let correctRole = "nothing";

    person.guild.roles.cache.forEach(role => {
        if(role.name.startsWith('|')) roleArray.push([role.name, role]);
    });

    roleArray.sort(function(a, b){

      let a1 = parseInt(a[0].split(" ")[1])
      let b1 = parseInt(b[0].split(" ")[1])

      return a1 - b1;

    });

    for(var a = 0; a < roleArray.length; a++){

      let role = roleArray[a][1];
      let amount = parseInt(roleArray[a][0].split(" ")[1])

      if( ( amount > currentpoints || a == roleArray.length-1 ) && correctRole == "nothing"){

        if(amount > currentpoints) correctRole = roleArray[a-1][1]
        else correctRole = roleArray[a][1]

        console.log(correctRole.name + " is the right rolejflksjsldk")

        roleevents.push( [person, correctRole, "add"] )
        break;

      }

    }

    for(var a = 0; a < roleArray.length; a++){
      let role = roleArray[a][1];

      if(role != correctRole) roleevents.push( [person, role, "Remove"] )

    }

}


function backup(){

  let time = new Date().toLocaleString().split("/").join("-").split(":").join(".");
  console.log("BACKING UP FILES " + time)

  let database = fs.readFileSync("points.json", "utf8");
  let maps = fs.readFileSync("maps.json", "utf8");
  let collections = fs.readFileSync("collections.json", "utf8");

  fs.mkdirSync(`backups/${time}`)

  fs.writeFileSync(`backups/${time}/collections.json`, collections)
  fs.writeFileSync(`backups/${time}/maps.json`, maps)
  fs.writeFileSync(`backups/${time}/points.json`, database)

  console.log("FINISHED BACKUP")

}

setInterval(backup, 3600000);

function refreshUser(person){
  let list = database[person]["maps"];
  let correctarr = [];

  for(var a = 0; a < list.length; a++) if(list[a] in maps) correctarr.push(list[a]);




  database[person]["maps"] = correctarr;
  //return correctarr;
}

function totalRecieved(person){

  refreshUser(person);

  let arr = database[person]["maps"];
  let recieved = {}

  arr.sort(function(a,b){

    return maps[b]["amount"] - maps[a]["amount"]

  })

  for(var a = 0; a < arr.length; a++){
    if(arr[a] in maps) {
      recieved[arr[a]] = Math.round( maps[arr[a]]["amount"] * 0.95**a * 100 ) / 100;
    }
  }

  console.log("Returned");

  return recieved
}

function totalPoints(person){
  let points = 0;

  refreshUser(person);

  let arr = database[person]["maps"];

  points += database[person]["regularpoints"];

  arr.sort(function(a,b){

    return maps[b]["amount"] - maps[a]["amount"]

  })

  for(var a = 0; a < arr.length; a++){
    if(arr[a] in maps) {
      points += maps[arr[a]]["amount"] * 0.95**a;
    }
  }

  console.log("Returned");

  return Math.round(points);
}

function totalPointsType(person, type){

  let arr = database[person]["maps"];

  refreshUser(person);

  arr.sort(function(a,b){

    return maps[b]["amount"] - maps[a]["amount"]

  })

  //Refresh User



  let sum = 0;

  for(var a = 0; a < arr.length; a++){

    if(arr[a] in maps){
      if(maps[arr[a]]["type"] == type) sum += maps[arr[a]]["amount"] * 0.95**a;
    }

  }

  return Math.round(sum);
}

function getMember(message, name, mention){

  let tryguild = message.guild.members.get(name);

  if(mention) return mention;
  if(id in tryguild) return tryguild;

  return "none";

}

function createTicket(player, message){
  let category;
  let everyoneRole;
  let staffRole;
  let channelName = message.channel.name;

  if(channelName.includes("claim-points") == false && channelName != "bot-commands"){

    return message.channel.send("Command only allowed in claim-points or bot-commands channel");

  }

  message.guild.roles.cache.forEach(role => {
    if(role.name == "@everyone") everyoneRole = role;
  })

  message.guild.roles.cache.forEach(role => {
    if(role.name == "Staff") staffRole = role;
  })

  category = message.channel.parent

  message.guild.channels.create(`Ticket ${ticketcounter} User ${player.tag} ID ${player.id}`, {
    type: 'text',
    parent: category,
    permissionOverwrites: [{
      id: client.user.id,
      allow: ['VIEW_CHANNEL','ATTACH_FILES','EMBED_LINKS','READ_MESSAGE_HISTORY']
    },{
      id: player.id,
      allow: ['VIEW_CHANNEL','ATTACH_FILES','EMBED_LINKS','READ_MESSAGE_HISTORY']
    },{
      id: staffRole.id,
      allow: ['VIEW_CHANNEL','ATTACH_FILES','EMBED_LINKS','READ_MESSAGE_HISTORY']
    },{
      id: everyoneRole.id,
      deny: ['VIEW_CHANNEL']
    }]
  });

  console.log("Channel created!");

  ticketcounter++;
}

async function replyInteraction(id, token, json, content = "", row = ""){

  console.log(id);

  let url = `https://discord.com/api/v8/interactions/${id}/${token}/callback`

  let body = {
      "type": 4,
      "data": {
        "tts": false,
        "content": content,
        "allowed_mentions": { "parse": [] },

      }
  }

  if(json != ""){
    console.log(json);
    body.data.embeds = [json.toJSON()]
  }
  if(row != ""){

    body.data.components = [JSON.parse(JSON.stringify(row.toJSON()))]

    console.log(body.data.components)

    body.data.components[0].type = 1;
  }

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bot " + client.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)

  })

  let res = await fetch(`https://discord.com/api/v8/webhooks/${config.appid}/${token}/messages/@original`, {
      method: "GET",
      headers: {
        "Authorization": "Bot " + client.token,
        "Content-Type": "application/json"
      },

  })

  let data = await res.json();
  let messages = await client.channels.cache.get(data.channel_id).messages.fetch({ limit: 5 });
  let message = messages.get(data.id);

  console.log(message);

  return message;

}
