const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

const deposit = () => {
    while (true) {
        const deposit = prompt("Deposit Amount: ");
        const numberDeposit = parseFloat(deposit);

        if (isNaN(numberDeposit) || deposit <= 0){
            console.log("invalid number try again...");
        } else {
            return numberDeposit;
        }
    }
}

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("enter lines: ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3){
            console.log("invalid number try again...");
        } else {
            return numberOfLines;
        }
    }
}

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("enter bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines){
            console.log("invalid number try again...");
        } else {
            return bet;
        }
    }
}

const spin = () => {
    const symbols = [];

    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0 ; i < count ; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0 ; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0 ; j < ROWS;  j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

const transpose = (matrix) =>
  matrix[0].map((_, i) => matrix.map((row) => row[i]));

const printRows = (rows) => {
    for (const row of rows) {
        let rowStr = "";
        for (const [i, symbol] of row.entries()) {
            rowStr += symbol
            if (i != row.length - 1) {
                rowStr += " | "
            }
        }
        console.log(rowStr);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0 ; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const round = () => {
    
    let balance = deposit();

    while (true) {
        console.log("You have $" + balance);
        const linesAmount = getNumberOfLines();
        const bet = getBet(balance, linesAmount);
        balance -= bet * linesAmount;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, linesAmount);
        console.log("You won  $" + winnings.toString());
        balance += winnings;

        if (balance <= 0 ) {
            console.log("No money left")
            break;
        }

        const playAgain = prompt ("wanna play again y/n");
        if (playAgain != "y") break;
    }
}

round();
