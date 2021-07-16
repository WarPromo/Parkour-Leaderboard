if(command == "m!45"){

  let n = Math.floor( Math.random()*900 ) / 10;


  if(message.author.id in fortyfives){
    return message.channel.send("You're on a cooldown, 5 minutes");
  }

  if(n == 45){
    setTimeout(() => message.channel.send(`<@${message.author.id}> 🔥🔥🔥🔥🔥🔥PERFECT 45💯💯💯💯💯💯 YOUR 45 WAS 45.0!🤑🤑🤑🤑🤑🤑`), 5000 )
  }
  else{
    message.channel.send(`<@${message.author.id}> Not a perfect 45 noob, ${n}`)
  }

  fortyfives[message.author.id] = true;

  setTimeout(() => delete fortyfives[message.author.id], 300000);

}
