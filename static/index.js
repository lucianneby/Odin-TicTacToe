const Gameboard = (() => {
  const BOARD_DIMENTIONS = {rows: 3, columns: 3, consecutiveToWin: 3}
  const _board = new Array(BOARD_DIMENTIONS.rows * BOARD_DIMENTIONS.columns);

  const placeMark = (square, mark) => {
   _board[square] = `${mark}`;
  };

  const displayInConsole = () => {
    for (let i = 0; i < _board.length; i += 3) {
      console.log(`${_board[i]} || ${_board[i+1]} || ${_board[i+2]}`)
    }
  }

  const displayOnPage = () => {
    const DOMGameboard = document.querySelector('.gameboard');

    let boardIndex = 0;

    for (let i = 0; i < BOARD_DIMENTIONS.rows; i++) {
      const row = DOMGameboard.rows[i];
      const cells = row.cells;

      for (let j = 0; j < BOARD_DIMENTIONS.columns; j++) {
        const cell = cells[j]

        cell.textContent = _board[boardIndex] || '';
        boardIndex++;
      }
    }
  }

  const checkWinner = (mark) => {
    const winningLines = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6]];

    for (let i = 0; i < winningLines.length; i++) {
      const lineIndices = winningLines[i];
      const boardValuesOnLine = [];

      for (let j = 0; j < lineIndices.length; j++) {
        boardValuesOnLine.push(_board[lineIndices[j]]);
      }

      if (boardValuesOnLine.every((value) => value === mark)) {
        return true;
      }
    }
    return false;
  }

  const announceWinner = (mark) => {
    console.log(`${mark} wins!`);
  }

  const generateWinningLines = (BOARD_DIMENTIONS) => {
    // write algorithm for generating lines
  }

  return {placeMark, displayOnPage, displayInConsole, checkWinner, announceWinner}
})();


const createPlayer = function(mark) {
  const placeMark = (square) => {
    Gameboard.placeMark(square, mark);
    Gameboard.displayOnPage();

    if (Gameboard.checkWinner(mark)) {
      Gameboard.announceWinner(mark);
    }

  };

  return {mark, placeMark};
};


const playerX = createPlayer('X');
const playerO = createPlayer('O');

playerO.placeMark(3);
playerO.placeMark(5);
playerO.placeMark(4);

Gameboard.displayInConsole(); // keeps displaying "3: x" no matter where I add the mark.
