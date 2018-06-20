/*
My own random order engine based on array.splice
 "" serves as placeholder to use splice on
trimmed with pop when process is over
*/

function getRandom(x) {
  let a = Math.floor(Math.random() * x);
  return a;
}

function generateOrder() {
  let initialOrder = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
  let randomOrder = [""];
  let a;
  let number;
  let randomPos;
  //injecting 8 pairs into 16 item display
  for (a = 0; a <= 15; a++) {
    number = initialOrder[a];
    randomPos = getRandom(randomOrder.length);
    randomOrder.splice(randomPos, 0, number);
  }
  randomOrder.pop();
  return randomOrder;
}

/*
1. Construct table and create styles
to easily identify and access particular cell later.
*/

function displayTable(x) {
  let a;
  let b;
  let counter = 0;
  let tableCreationcode = "<table>";
  for (a = 0; a <= 3; a++) {
    tableCreationcode += "<tr class>";
    for (b = 0; b <= 3; b++) {
      tableCreationcode += `<td class = "pos${counter + 1}">?</td>`;
      counter++;
    }
    tableCreationcode += "</tr>";
  }
  tableCreationcode += "</table";
  /*place the table*/
  $(".victoryModal").before(tableCreationcode);
}

/* inject data about card, position and state -for ease of later
use into one object bound to particular element */

function injectData(x) {
  let c;
  for (c = 1; c <= 16; c++) {
    $(`.pos${c}`).data("card", {
      pairNo: x[c - 1],
      position: c,
      isIngame: true
    });
  }
}

function showTurninfo(x) {
  $("p.turn").html(`Moves: <span class = inverse>${x}</span>`);
}

function displayCommunicate(x) {
  $("h2").html(x);
}

//parameters: element, class to toggle, time for temporary toggle
function tempClasstoggle(x, y, z) {
  $(x).toggleClass(y);
  setTimeout(function() {
    $(x).toggleClass(y);
  }, z);
}

function stopWatch() {
  let minutes = Math.floor(startTime / 60);
  minutes = ("0" + minutes).slice(-2);
  let seconds = startTime % 60;
  seconds = ("0" + seconds).slice(-2);
  $(".time").text(`time: ${minutes}:${seconds}`);
  startTime++;
}
//x=current number of moves
function ratingCalc(x) {
  if (x <= 30) {
    return 3;
  } else if (x > 30 && x <= 45) {
    return 2;
  } else {
    return 1;
  }
}

/*************INITIALIZE NEW GAME*********************
 ******************************************************/

//initialize variables
let intervalIdent;
let timerStarted = false;
let startTime = 0;
let rating = 3;
let won = false;
let card1 = [0, 0, true];
let card2 = [0, 0, true];
let fullBuffer = false;
let cardsStillinplay = [1, 2, 3, 4, 5, 6, 7, 8];
let turnCounter = 0;
let finalOrder = generateOrder();
let overflow = false;

//initialize game interface
displayTable(finalOrder);
injectData(finalOrder);
showTurninfo(turnCounter);

/*************listen to click events!*********************
 ************ PROGRAM LOGIC STARTS HERE ******************/

function newGame() {
  $("td").click(function() {
    //initialize timer
    if (!timerStarted) {
      intervalIdent = setInterval(stopWatch, 1000);
      timerStarted = true;
    }

    /*proceed only if card is -in play && not same one (POS) clicked again &&! 2 already revealed */

    if (
      $(this).data("card").isIngame === true &&
      $(this).data("card").position != card1[1] &&
      overflow === false
    ) {
      //remove question mark
      $(this).text("");

      /*check if exactly ONE card is revealed
       */

      if (!fullBuffer) {
        //store the info of the card for future comparison
        card1[0] = $(this).data("card").pairNo;
        card1[1] = $(this).data("card").position;
        card1[2] = $(this).data("card").isIngame;
        //display back of the card
        $(this).toggleClass(`pair${card1[0]}rev`);
        //change fullBuffer flag;
        fullBuffer = true;
      } else {
        /*we know that cards are exactly TWO*/

        //get card info
        card2[0] = $(this).data("card").pairNo;
        card2[1] = $(this).data("card").position;
        card2[2] = $(this).data("card").isIngame;
        $(this).toggleClass(`pair${card2[0]}rev`);
        //set overflow flag to prevent revealing 3rd card
        overflow = true;

        /*compare cards */

        if (card1[0] == card2[0]) {
          /*that is a hit!
          remove card from game (changing .data stored in element)
          and remove it from cardsStillinPlay
          array for purpose of victory checks*/

          cardsStillinplay.splice(cardsStillinplay.indexOf(card1[0]), 1);
          $(`.pair${card1[0]}rev`).data("card", {
            isIngame: false
          });

          //check for final victory
          if (cardsStillinplay.length === 0) {
            won = true;
          }
        } else {
          /*that is a miss
          reverse both cards bring back question marks*/
          setTimeout(function() {
            $(`.pos${card2[1]}`).toggleClass(`pair${card2[0]}rev`);
            $(`.pos${card1[1]}`).toggleClass(`pair${card1[0]}rev`);
            $(`.pos${card2[1]}`).text("?");
            $(`.pos${card1[1]}`).text("?");
          }, 1300);
        }

        setTimeout(function() {
          card1 = [0, 0, false];
          overflow = false;
          fullBuffer = false;
        }, 1300);
      }
      /*increase turn counter
      and update score*/
      setTimeout(function() {
        let disp;
        let com = "";
        turnCounter++;
        showTurninfo(turnCounter);
        disp = ratingCalc(turnCounter);
        switch (disp) {
          case 1:
            $("li i").css("display", "none");
            $("li i:last").css("display", "inline-block");
            break;
          case 2:
            $("li i").css("display", "inline-block");
            $("li i:last").css("display", "none");
            break;
          case 3:
            $("li i").css("display", "inline-block");
        }
        for (let x = 1; x <= disp; x++) {}
      }, 600);
    }
    if (won === true) {
      setTimeout(function() {
        let disp = ratingCalc(turnCounter);
        let starcount = disp > 1 ? "stars" : "star";
        $("table").css("display", "none");
        $(".victoryModal").css("display", "block");
        $(".reset.button:first").css("display", "none");
        $(".victoryModal").prepend(
          `<p class ='win'>You have won!<br>With ${turnCounter} moves and ${disp} ${starcount}</p>`
        );
        clearInterval(intervalIdent);
        //will REALLY will it work? maybe yes maybe no
        won = false;
      }, 1500);
    }
  });

  /* button listeners */
  $(".reset.button").click(function() {
    //kill old stuff
    $("table").remove();
    $(".victoryModal").css("display", "none");
    $(".reset.button:first").css("display", "inline");
    $("li i").css("display", "inline-block");
    $(".win").remove();
    //stop timer
    clearInterval(intervalIdent);
    $(".time").text(`time: `);
    //reinitialize
    timerStarted = false;
    startTime = 0;
    rating = 3;
    won = false;
    card1 = [0, 0, true];
    card2 = [0, 0, true];
    fullBuffer = false;
    cardsStillinplay = [1, 2, 3, 4, 5, 6, 7, 8];
    turnCounter = 0;
    finalOrder = generateOrder();
    overflow = false;
    //re initialize game interface
    displayTable(finalOrder);
    injectData(finalOrder);
    showTurninfo(turnCounter);
    newGame();
  });
}
newGame();
