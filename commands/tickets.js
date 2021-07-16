
const disbut = require("discord-buttons")


if(command == "m!sendticketmessage"){

  let btn = new disbut.MessageButton()
    .setStyle('green')
    .setLabel('        🤯        ')
    .setID("createTicket")
  message.channel.send('Create a ticket?', {
    button: btn
  })

}

if(command == "m!createticket"){

  if(message.author.id in currentTickets){
    message.delete();
    return;
  }

  createTicket(message.author, message)

  currentTickets[message.author.id] = true;
  message.delete();

}

if(command == "m!closeticket"){
  if(message.channel.name.includes("ticket")){
    let id = message.channel.name.split("-")
    id = id[id.length-1];
    delete currentTickets[id];
    message.channel.delete();
  }
  else message.channel.send("This is not a ticket channel");
}
