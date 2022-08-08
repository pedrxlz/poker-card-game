var cardsCombinationScore = [
  "Carta alta", //0
  "Par", //1
  "Dois pares", //2
  "Trinca", //3
  "Straight", //4
  "Flush", //5
  "Fullhouse", //6
  "Quadra", //7
  "Straight flush", //8
  "Royal Flush", //9
];

var deck = [];
let cardsPileDict = [];

var board;
var robotOne;
var robotTwo;

class Player {
  constructor(score, cards) {
    this.score = score;
    this.cards = cards;
    this.combination;
    this.deck;
    this.win;
  }

  setScore(score) {
    score > this.score ? (this.score = score) : this.score;
  }

  getCombination() {
    this.combination = cardsCombinationScore[this.score];
    return this.combination;
  }
}

class Card {
  constructor(id, value, suit) {
    this.id = id;
    this.value = value;
    this.suit = suit;
  }
}

window.onload = function () {
  buildCardsPile();
  buildDeck();
  startGame();
};

function buildCardsPile(counter = 0) {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let suits = ["C", "E", "O", "P"];

  for (i in suits) {
    for (j in values) {
      let id = values[j] + suits[i];
      cardsPileDict[counter] = new Card(id, values[j], suits[i]);
      counter++;
    }
  }
}

var randomProperty = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

function buildDeck() {
  while (deck.length < 9) {
    let newCard = randomProperty(cardsPileDict);
    if (deck.filter((e) => e.id == newCard.id).length > 0) {
    } else {
      deck.push(newCard);
    }
  }

  console.log("deck ", deck);
}

function startGame() {
  robotOne = new Player(0, [deck[5], deck[6]], "");
  robotTwo = new Player(0, [deck[7], deck[8]], "");
  board = [deck[0], deck[1], deck[2], deck[3], deck[4]];
  console.log("robotOne cards ", robotOne.cards);
  console.log("robotTwo cards ", robotTwo.cards);
  console.log("board cards ", board);

  for (let i = 0; i < 5; i++) {
    let cardImg = document.createElement("img");
    let card = board[i].id;
    cardImg.src = "./cards/" + card + ".png";
    document.getElementById("table-cards").append(cardImg);
  }

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = robotOne.cards[i].id;
    cardImg.src = "./cards/" + card + ".png";
    document.getElementById("your-cards").append(cardImg);
  }

  document
    .getElementById("check-winner")
    .addEventListener("click", checkWinner);
}

function checkWinner() {
  robotOne.setScore(royalFlush(robotOne.cards.concat(board)));
  robotTwo.setScore(royalFlush(robotTwo.cards.concat(board)));

  if (flush(robotOne.cards.concat(board)) <= 2) robotOne.setScore(5);
  if (flush(robotTwo.cards.concat(board)) <= 2) robotTwo.setScore(5);

  checkStraightCombination(board, robotOne);
  checkDuplicateCombination(board, robotOne);
  checkStraightCombination(board, robotTwo);
  checkDuplicateCombination(board, robotTwo);

  if (robotOne.score > robotTwo.score) {
    robotOne.win = true;
    robotTwo.win = false;
  } else {
    if (robotOne.score == robotTwo.score) {
      robotOne.win = true;
      robotTwo.win = true;
    }
    if (robotOne.score < robotTwo.score) {
      robotTwo.win = true;
      robotOne.win = false;
    }
  }

  if (robotOne.score == 0 && robotTwo.score == 0) {
    robotOne.win = false;
    robotTwo.win = false;
    let robotOneHighCard = highestCard(robotOne.cards);
    let robotTwoHighCard = highestCard(robotTwo.cards);
    if (robotOneHighCard > robotTwoHighCard) {
      robotOne.win = true;
      robotTwo.win = false;
    } else {
      if (robotOneHighCard == robotTwoHighCard) {
        robotOne.win = true;
        robotTwo.win = true;
      }
      if (robotOneHighCard < robotOneHighCard) {
        robotTwo.win = true;
        robotOne.win = false;
      }
    }
  }

  let winMessage = document.createElement("h2");

  if (robotOne.win && !robotTwo.win) {
    winMessage.innerHTML = `Vencedor: Robo 1 - ${robotOne.getCombination()}`;
  }
  if (robotTwo.win && !robotOne.win) {
    winMessage.innerHTML = `Vencedor: Robo 2 - ${robotTwo.getCombination()}`;
  }
  if (robotOne.win && robotTwo.win) {
    winMessage.innerHTML = `Empate!`;
  }

  document.getElementById("winner-info").append(winMessage);

  console.log(
    "Robo 1 - score: ",
    robotOne.score,
    "combination: ",
    robotOne.getCombination()
  );
  console.log(
    "Robo 2 - score: ",
    robotTwo.score,
    "combination: ",
    robotTwo.getCombination()
  );

  const list = document.getElementById("dealer-cards");

  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = robotTwo.cards[i].id;
    cardImg.src = "./cards/" + card + ".png";
    document.getElementById("dealer-cards").append(cardImg);
  }
}

let playerCards = [];

function checkDuplicateCombination(table, player) {
  let playerDeckCombination = player.cards.concat(table);
  let cardsValueRepeated = toFindDuplicates(playerDeckCombination);

  let pair = 0;
  let threeOfAKind = 0;
  let fourOfAKind = 0;

  Object.entries(cardsValueRepeated).forEach((entry) => {
    const [key, value] = entry;

    switch (value) {
      case 2:
        playerCards = playerCards.concat(
          playerDeckCombination.filter((elem) => elem.value == key && pair < 2)
        );
        pair++;
        break;
      case 3:
        playerCards = playerCards.concat(
          playerDeckCombination.filter(
            (elem) => elem.value == key && threeOfAKind < 1
          )
        );
        threeOfAKind++;
        break;
      case 4:
        playerCards = playerCards.concat(
          playerDeckCombination.filter((elem) => elem.value == key)
        );
        fourOfAKind++;
        break;
    }
  });

  scoreUpdate(player, pair, threeOfAKind, fourOfAKind);

  Object.entries(cardsValueRepeated).forEach((entry) => {
    const [key, value] = entry;
    if (value == 1)
      playerCards = playerCards.concat(
        playerDeckCombination.filter(
          (elem) => elem.value == key && playerCards.length < 5
        )
      );
  });

  playerCards = [];
  console.log("player deck", playerCards);
  console.log("repeated values", cardsValueRepeated);
}

function scoreUpdate(player, pair, threeOfAKind, fourOfAKind) {
  if (pair == 1) player.setScore(1);

  if (pair > 1) player.setScore(2);

  if (threeOfAKind == 1) player.setScore(3);

  if (threeOfAKind == 1 && pair >= 1) player.setScore(6);

  if (fourOfAKind == 1) player.setScore(7);
}

function checkStraightCombination(table, player) {
  let playerDeckCombination = table.concat(player.cards);

  playerDeckCombination = eliminateDuplicates(playerDeckCombination);
  flush(playerDeckCombination);
  console.log("playerDeckCombination ", playerDeckCombination);

  let straights = straight(playerDeckCombination);
  straights == 4 ? robotOne.setScore(4) : straights;
}

function eliminateDuplicates(arr) {
  var i,
    len = arr.length,
    out = [],
    obj = {};

  for (i = 0; i < len; i++) {
    obj[getValue(arr[i])] = 0;
  }
  for (i in obj) {
    let card = arr.find((elem) => getValue(elem) == i);
    out.push(card);
  }
  return out;
}

let crds = [];

function straight(deck, counter = 0) {
  const differenceArray = deck.slice(1).map((n, i) => {
    let difference = getValue(n) - getValue(deck[i]);
    if (difference == 1) {
      counter++;
      if (crds.length == 0) {
        crds.push(deck[i]);
      }
      crds.push(n);
    } else {
      if (counter != 4) counter = 0;
    }
  });
  console.log("crds", crds);
  return counter;
}

var playerDeck = [];

function toFindDuplicates(array) {
  const count = {};

  array.forEach((item, index) => {
    if (count[item.value]) {
      count[item.value] += 1;
      return;
    }
    count[item.value] = 1;
  });

  return count;
}

function getValue(card) {
  let value = card.value;

  if (isNaN(parseInt(value))) {
    switch (value) {
      case "J":
        value = 11;
        break;
      case "Q":
        value = 12;
        break;
      case "K":
        value = 13;
        break;
      case "A":
        value = 1;
        break;
    }
  }
  return parseInt(value);
}

function highestCard(deck) {
  return deck.reduce(function (p, v) {
    return getValue(p) > getValue(v) ? getValue(p) : getValue(v);
  });
}

function flush(deck, suits = []) {
  for (card in deck) {
    suits[card] = deck[card].suit;
  }

  let filtrado = suits.filter((elem, pos, arr) => arr.indexOf(elem) == pos);

  return filtrado.length;
}

function royalFlush(deck, arr = [], royalValues = ["10", "J", "Q", "K", "A"]) {
  for (value in royalValues) {
    let card = deck.find((elem) => elem.value == royalValues[value]);
    if (card) {
      arr.push(card);
    }
  }

  return arr.length == 5 && flush(arr) ? 9 : 0;
}
