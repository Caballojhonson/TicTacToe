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
    const copy = _cellValues;

    const incrementCounter = () => counter++;

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
    }

    return { render, populateCells, play, listen, copy };
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
        playerOne.name = playerOneInput.value;
        playerTwo.name = playerTwoInput.value;
    })

    function assignSymbol() {
        if (playerOne.symbol == 'x') {
            return playerTwo.symbol = 'o';
        } else if (playerOne.symbol == 'o') {
            return playerTwo.symbol = 'x';
        }
    }

    assignSymbol()

    return { playerOne, playerTwo }
})();

const logic = (() => {

    const cellValues = () => Object.values(board.copy);
    const combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [6, 4, 2]
        ];
    let indexesO = [];
    let indexesX = [];

    const getIndexes = () => {
        for (let i = 0; i < cellValues().length; i++) {
            if(cellValues()[i] == 'o') indexesO.push(i);
            if(cellValues()[i] == 'x') indexesX.push(i);
        }
    }

    const evaluateGame = () => {
        
    }

    return { getIndexes, indexesO, indexesX, cellValues }
})();

board.render()
board.populateCells()
board.listen()