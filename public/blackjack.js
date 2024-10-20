let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true; // allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
    setupPlayAgainButton(); // Set up Play Again button on page load
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); // A-C -> K-C, A-D -> K-D
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    // Dealer gets two cards: one face down, one face up
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    let secondCard = deck.pop();
    let cardImg = document.createElement("img");
    cardImg.src = "./cards/" + secondCard + ".png";
    document.getElementById("dealer-cards").append(cardImg);
    dealerSum += getValue(secondCard);
    dealerAceCount += checkAce(secondCard);

    // The player gets two cards face up
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
}

function stay() {
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"; // Reveal dealer's hidden card

    // Dealer must keep drawing cards until their sum is at least 17
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    } else if (dealerSum > 21) {
        message = "You Win!";
    } else if (yourSum === dealerSum) {
        message = "Tie!";
    } else if (yourSum > dealerSum) {
        message = "You Win!";
    } else {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

    // Show the Play Again button after 1 second
    setTimeout(() => {
        document.getElementById("play-again").style.display = "block";
    }, 1000);
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) { // A, J, Q, K
        if (value === "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] === "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

// Setup the Play Again button
function setupPlayAgainButton() {
    let playAgainBtn = document.getElementById("play-again");
    
    // Make the button bigger
    playAgainBtn.style.fontSize = "30px";
    playAgainBtn.style.padding = "15px 30px";
    playAgainBtn.style.backgroundColor = "green"; // Change button color
    playAgainBtn.style.color = "white";

    // Add event listener to reload the page
    playAgainBtn.addEventListener("click", () => {
        window.location.reload(); // Reload the page to start a new game
    });

    // Hide it initially
    playAgainBtn.style.display = "none";
}
