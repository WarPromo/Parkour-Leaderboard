

if(command == "m!anonsuggest"){

  message.delete();

  if(message.channel.name.includes("suggestions") == false){
    message.channel.send("You can only use that command in a suggestions channel").then(m => {
      setTimeout(() => {
        m.delete();
      }, 3000);
    })
    return;
  }

  let channel = message.guild.channels.cache.find( channel => channel.name == "polls" )

  if(!channel) return;

  let messages = await channel.messages.fetch({ limit: 10 })
  messages = messages.filter( (m) => m.embeds.length > 0 )
  let lastSuggestion = messages.first();
  //let num = parseInt( lastSuggestion.embeds[0].title.split("#")[1] ) + 1;

  if(!args[1]) return;

  let suggestion = message.content.replace("m!anonsuggest ", "");

  const embed = new Discord.MessageEmbed()
    .setTitle('Suggestion ')
    .setAuthor('Anonymous User', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.drodd.com%2Fimages16%2Fblack-color21.png')
    .setDescription(suggestion)

  console.log(embed);

  let m = await channel.send(embed);

  await m.react("⬆️");
  await m.react("⬇️");




}
