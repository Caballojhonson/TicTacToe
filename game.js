const board = (() => {

    let cellValues = {
        a1: 'x',
        b1: 'o',
        c1: 'x',
        a2: 'o',
        b2: 'o',
        c2: 'x',
        a3: 'o',
        b3: 'x',
        c3: 'o'
    };

    const generateBoard = () => {
        const cells = Object.keys(board.cellValues);
        const grid = document.getElementById('grid');

        for (let i = 0; i < cells.length; i++) {
            grid.appendChild(document.createElement('div'));
            grid.children[i].id = cells[i];
            grid.children[i].classList.add('cell')  
        }
    }
        return {cellValues, generateBoard};

})();

board.generateBoard();




