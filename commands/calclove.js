if(command == "m!calculatelove"){

  let mentions = message.mentions.members.array();
  let keys = Object.keys(mentions)

  if(mentions.length != 2) return message.channel.send("Provide the correct amount of users (Provide 2)")

  if(mentions[0]+"" == mentions[1]+"") return message.channel.send("Those are the same people");


  console.log(mentions);

  let love = calculateLove(mentions[0].id, mentions[1].id);

  let embed = new Discord.MessageEmbed();

  embed.addField("User1💕", mentions[0].user.username, true);
  embed.addField("🤔Amount🤔", "😱 "+love + "% "+"😱", true);
  embed.addField("💕User2", mentions[1].user.username, true);

  embed.setColor([love, 0, 0]);

  message.channel.send(embed)

}

function calculateLove(n1, n2){

  let a = n1+"";
  let b = n2+"";

  a = a.substring(a.length - 3, a.length);
  b = b.substring(b.length - 3, b.length);

  let c = (a * b)+""

  return parseInt( c.substring(a.length - 2, a.length) ) + 1;

}
