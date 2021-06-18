const board = (() => {
    let _cellValues = {
        a1: '',
        b1: '',
        c1: '',
        a2: '',
        b2: '',
        c2: '',
        a3: '',
        b3: '',
        c3: ''
    }

    const grid = document.getElementById('grid');
    const cells = Object.keys(_cellValues);
    const values = () => Object.values(_cellValues);
    const domCells = () => document.querySelectorAll('.cell');
    let counter = 1;

    const incrementCounter = () => counter++;

    const readCounter = () => counter;

    const listen = () => {
        grid.addEventListener('click', (event) => {
            if (event.target.parentNode.classList == 'cell') {
                return turn(event.target.parentNode.id);
            } else {
                return turn(event.target.id);
            }
        })
    }

    const render = () => {
        for (let i = 0; i < cells.length; i++) {
            grid.appendChild(document.createElement('div'));
            grid.children[i].id = cells[i];
            grid.children[i].classList.add('cell');
        }
    }

    const populateCells = () => {

        for (let i = 0; i < cells.length; i++) {
            if (domCells()[i].hasChildNodes() === false) {
                if (values()[i] === 'x') {
                    document.getElementById(cells[i])
                        .appendChild(document.createElement('img'))
                        .setAttribute('src', 'icons/x.png')
                } else if (values()[i] === 'o') {
                    document.getElementById(cells[i])
                        .appendChild(document.createElement('img'))
                        .setAttribute('src', 'icons/o.png')
                }
            }
        }
    }

    const turn = (cell) => {
        incrementCounter();
        if (counter % 2 === 0) return play(cell, 'x')
        else return play(cell, 'o')
    }

    const play = (cell, symbol) => {
        _cellValues[cell] = symbol;
        populateCells();
        logic.getIndexes();
        logic.evaluateGame();
    }

    const reset = () => {
        _cellValues = {a1: '', b1: '', c1: '', a2: '',
            b2: '', c2: '', a3: '', b3: '', c3: ''};

        for (let i = 0; i < domCells().length; i++) {
            if(domCells()[i].firstChild) domCells()[i].removeChild(domCells()[i].firstChild);
        }

        populateCells();
        logic.reset();
    }

    return { render, populateCells, play, listen, values, reset, readCounter };
})();

const Player = who => {
    const name = who;
    const symbol = randomizeSymbol();

    function randomizeSymbol() {
        let randNum = Math.random();
        if (randNum >= 0.5) {
            return 'x';
        } else {
            return 'o';
        }
    }

    return { name, symbol };
}

const players = (() => {
    const playerOneInput = document.getElementById('playerOne');
    const playerTwoInput = document.getElementById('playerTwo');
    const startBtn = document.getElementById('startBtn');
    let playerOne = Player('Anonymous')
    let playerTwo = Player('Anonymous')

    startBtn.addEventListener('click', () => {
        playerOne.name = playerOneInput.value === '' ? 'Player One' : playerOneInput.value;
        playerTwo.name = playerTwoInput.value === '' ? 'Player Two' : playerTwoInput.value;
        display.hideStartScreen();
        display.populateSymbolScreen();
        display.score();
    })

    function assignSymbol() {
        if (playerOne.symbol == 'x') {
            return playerTwo.symbol = 'o';
        } else if (playerOne.symbol == 'o') {
            return playerTwo.symbol = 'x';
        }
    }

    assignSymbol();

    return { playerOne, playerTwo }
})();

const logic = (() => {

    const cellValues = () => board.values();
    const combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [6, 4, 2]
    ];
    let indexesO = [];
    let indexesX = [];
    let winCountO = 0;
    let winCountX = 0;

    const getIndexes = () => {
        for (let i = 0; i < cellValues().length; i++) {
            if (cellValues()[i] == 'o') indexesO.push(i);
            if (cellValues()[i] == 'x') indexesX.push(i);
        }
    }

    const evaluateGame = () => {
        for (let i = 0; i < combinations.length; i++) {
            if (combinations[i].every(num => indexesO.includes(num))) {
                 declareWinner('o');
                 ++winCountO;
            }
        }

        for (let i = 0; i < combinations.length; i++) {
            if (combinations[i].every(num => indexesX.includes(num))) {
                 declareWinner('x');
                 ++winCountX;
            }
        }

        if (cellValues().every(i => (i === 'x' || i === 'o'))) return declareWinner('tie');
    }

    const declareWinner = (symbol) => {
        display.showWinScreen();
        setTimeout(() => board.reset(), 1000)
        if (symbol === players.playerOne.symbol) return display.printWinner(players.playerOne.name);
        if (symbol === players.playerTwo.symbol) return display.printWinner(players.playerTwo.name);
        if (symbol === 'tie') return display.printWinner('Tie!');
    }

    const reset = () => {
        indexesO = [];
        indexesX = [];
    }

    const winCount = () => [winCountX, winCountO]

    return { getIndexes, evaluateGame, reset, winCount }
})();

const display = (() => {

    const hideStartScreen = () => {
        const startScreen = document.getElementById('startScreen');
        startScreen.style.display = 'none';
    }

    const populateSymbolScreen = () => {
        const symbolInputOne = document.getElementById('symbolOne');
        const symbolInputTwo = document.getElementById('symbolTwo');
        const starts = document.getElementById('starts');

        
        if (players.playerOne.symbol === 'x' && board.readCounter() === 1) {
            starts.textContent = players.playerOne.name + ' Starts';
        }else if (players.playerOne.symbol === 'o' && board.readCounter() === 1) {
            starts.textContent = players.playerTwo.name + ' Starts';
        }else if (board.readCounter() % 2 === 0 && players.playerOne.symbol === 'o') {
            starts.textContent = players.playerOne.name + ' Starts';
        }else if (board.readCounter() % 2 === 0 && players.playerTwo.symbol === 'o') {
            starts.textContent = players.playerTwo.name + ' Starts';
        }else if (board.readCounter() % 2 !== 0 && players.playerOne.symbol === 'x') {
            starts.textContent = players.playerOne.name + ' Starts';
        }else if (board.readCounter() % 2 !== 0 && players.playerTwo.symbol === 'x') {
            starts.textContent = players.playerTwo.name + ' Starts';
        }

        symbolInputOne.textContent = (players.playerOne.name + ' plays as ' + players.playerOne.symbol.toUpperCase());
        symbolInputTwo.textContent = (players.playerTwo.name + ' plays as ' + players.playerTwo.symbol.toUpperCase());

        setTimeout(() => hideSymbolScreen(), 3000)
    }

    const hideSymbolScreen = () => {
        const symbolScreen = document.getElementById('symbolScreen');
        symbolScreen.style.display = 'none';
    }

    const showSymbolScreen = () => {
        const symbolScreen = document.getElementById('symbolScreen');
        symbolScreen.style.display = 'flex';
        setTimeout(() => hideSymbolScreen(), 3500)
    }

    const showWinScreen = () => {
        const winScreen = document.getElementById('winScreen');
        winScreen.style.display = 'flex';
        printWinner();
    }

    const printWinner = (winner) => {
        const winnerTitle = document.getElementById('winner');
        winner === 'Tie!' ? winnerTitle.textContent = 'It\'s a tie!' :
        winnerTitle.textContent = winner + ' ' + 'Wins!'
    }

    const hideWinScreen = () => {
        document.getElementById('winScreen').style.display = 'none';
    }

    const score = () => {
        nameOne = document.getElementById('pOneName');
        nameTwo = document.getElementById('pTwoName');
        scoreOne = document.getElementById('pOneScore');
        scoreTwo = document.getElementById('pTwoScore');

        nameOne.textContent = players.playerOne.name;
        nameTwo.textContent = players.playerTwo.name;
        scoreOne.textContent = logic.winCount()[0];
        scoreTwo.textContent = logic.winCount()[1];

    }

    // Restart Game on RestartBtn click
    document.getElementById('restartBtn').addEventListener('click', () => {
        board.reset();
        populateSymbolScreen();
        showSymbolScreen();
        score();
        hideWinScreen();
    })

    return { hideStartScreen, showWinScreen, printWinner, populateSymbolScreen, score }

})();

board.render()
board.populateCells()
board.listen()
