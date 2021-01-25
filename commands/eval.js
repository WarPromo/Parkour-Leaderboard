if(command == "!e"){


  let messagecode = message.content.substring(3, message.content.length);

  try{

    eval(messagecode);

  } catch(err){

    console.log(err);
    console.log(err.toString());

  };


}
