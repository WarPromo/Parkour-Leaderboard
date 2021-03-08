if(command == "m!createticket"){

  let category;
  let everyoneRole;
  let staffRole;
  let channelName = message.channel.name;

  if(channelName.includes("claim-points") == false && channelName != "bot-commands"){

    return message.channel.send("Command only allowed in claim-points or bot-commands channel");

  }

  message.guild.roles.forEach(role => {
    if(role.name == "@everyone") everyoneRole = role;
  })

  message.guild.roles.forEach(role => {
    if(role.name == "Staff") staffRole = role;
  })

  category = message.channel.parent

  message.guild.createChannel(`Ticket ${ticketcounter} User ${message.author.tag}`, {
    type: 'text',
    parent: category,
    permissionOverwrites: [{
      id: client.user.id,
      allow: ['VIEW_CHANNEL','ATTACH_FILES','EMBED_LINKS','READ_MESSAGE_HISTORY']
    },{
      id: message.author.id,
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

  message.delete();

}

if(command == "m!closeticket"){
  if(message.channel.name.includes("ticket")){
    message.channel.delete();
  }
  else message.channel.send("This is not a ticket channel");
}
