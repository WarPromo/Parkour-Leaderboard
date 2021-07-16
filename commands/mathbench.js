if(command == "m!mathbench" && message.channel.name != "general"){

  if(message.author.id in currentMaths){
    return message.channel.send("You are already in a benchmark, type m!mathquit to quit");
  }
  if(message.channel.id in currentMaths){
    return message.channel.send("A game is already going on in this channel");
  }


  if(args[1]+"" == "ENDLESS") message.channel.send("Endless benchmark mode");
  else message.channel.send("Starting 40 second benchmark in 2 seconds");

  let startTime = Date.now();
  let endTime = startTime
  let ended = false;
  let points = 0;
  let length = 40000;
  let equation = ""
  let answer = 0;
  let wrong = 0;


  currentMaths[message.channel.id] = true;
  currentMaths[message.author.id] = true;

  if(message.author.id in mathdb == false){
    mathdb[message.author.id] = {
      highscore: [ 0, Date.now() ],
      attempts: 0,
      totalpoints: 0,
      lastattempts: [],
      tag: message.author.tag
    }
  }

  await setTimeout(() => {

    let a = generateProblem();

    equation = a[0];
    answer = a[1];

    message.channel.send(equation);

    console.log("C");

    client.on("message", mes);


    console.log("D");

    return true;
  }, 2000)

  if(args[1]+"" != "ENDLESS"){
    setTimeout(endGame, length)
  }

  async function mes(m){

    if( m.author.id == message.author.id && m.content.toLowerCase() == "m!mathquit"){

      message.channel.send("Ending current game")
      client.off("message", mes);
      delete currentMaths[message.channel.id]
      delete currentMaths[message.author.id]
      message.channel.send("Game Ended");
      if(args[1]+"" == "ENDLESS"){
        let dt = (endTime - startTime) / 1000
        let answerps = (points + wrong) / dt
        let correctps = points / dt
        let ranswerps = Math.round(answerps*100)/100
        let rcorrectps = Math.round(correctps*100)/100
        if(endTime - startTime != 0) message.channel.send(`Answers per second: ~${ranswerps}/s ( ${ Math.floor(answerps*40) } per 40 seconds )\nCorrect Answers per second: ~${rcorrectps}/s ( ${ Math.floor(correctps*40) } per 40 seconds )\nCorrect Answers: ${points}\nWrong Answers: ${wrong}`);
      }
      ended = true;


      return;

    }

    if( m.author.id == message.author.id && m.channel.id == message.channel.id){


      if(parseInt(m.content) == answer){

        points++;

      }
      else{
        wrong++
      }

      endTime = Date.now();

      let a = generateProblem();

      equation = a[0];
      answer = a[1];

      message.channel.send(equation);
    }
  }

  function endGame(){
    if(ended == true) return;
    ended = true;
    message.channel.send("Benchmark ended!\nScore: " + points + " correct answers\nWrong answers: " + wrong);
    delete currentMaths[message.channel.id]
    delete currentMaths[message.author.id]

    let id = message.author.id

    if(points > mathdb[id].highscore[0]) mathdb[id].highscore = [points, Date.now()]
    mathdb[id].attempts++;
    mathdb[id].totalpoints += points;
    mathdb[id].lastattempts.push([points, length]);
    mathdb[id].tag = message.author.tag

    fs.writeFileSync("mathleaderboard.json", JSON.stringify(mathdb) )

    client.off("message", mes);
  }

  let currentproblem = "";



}




function generateProblem(){
  let operatorsa = [ "+", "-", "x", "/" ]

  let paranthasees = false;
  let length = 4;
  let range = [1, 10]

  let equation = ""
  let lastOperator = "";
  let lastNum = 0;

  for(var a = 0; a < length; a++){
    let n2 = Math.floor( Math.random() * operatorsa.length )
    let operators = operatorsa.join("").split(lastOperator).join("").split("");

    if(n2 == 0) operators = operatorsa.join("").split("/").join("").split("")



    let num = Math.floor(Math.random()* (range[1] - range[0]) ) + range[0]
    let operator = operators[Math.floor( Math.random()*operators.length )]

    if(lastOperator == "/") num = ( 2**( Math.ceil(lastNum / (num + 4) ) ) )
    lastNum = num
    if(operator == "/") num = ( 2**( Math.ceil(num / 4) ) )

    lastOperator = operator;


    if(a < length-1){
      equation += num;
      if(n2 == 0 && paranthasees == true){
        paranthasees = false;
        n2 = 1;
        equation += " )"
      }
      equation += " " + operator + " ";
      if(n2 == 0 && paranthasees == false){
        equation += " ( "
        paranthasees = true;
      }
    }
    if(a == length - 1){
      equation += num;

      if(paranthasees == true){
        equation += " )";
      }

    }

  }

  let answer;

  eval(`answer = ${equation.split("x").join("*")}`)

  return [equation, answer];

}
