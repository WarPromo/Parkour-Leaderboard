if(command == "m!help"){
  let string = "```";
  message.channel.send(`
${string}
m!createticket : Create a channel that only you, and staff can see

m!profile <@user> : View the profile of a player

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

m!calclove <user1> <user2> : Calculate the love % between two users

m!luckylb : See the leaderboard of luckiness scores

m!renamemap <map> <newname> : Rename a map
${string}
    `)
}
