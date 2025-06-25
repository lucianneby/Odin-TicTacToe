console.log('console log works'); // runs

document.addEventListener('DOMContentLoaded', () => {
  const Gameboard = (() => {
    const BOARD_DIMENTIONS = {rows: 3, columns: 3, consecutiveToWin: 3}
    const _board = new Array(BOARD_DIMENTIONS.rows * BOARD_DIMENTIONS.columns);
    const DOMGameboard = document.querySelector('.gameboard');
    let playerHasWon = false;

    let currentMark = 'X';

    const placeMark = (square) => {
      _board[square] = `${currentMark}`;
      
      if (currentMark === 'X') {
        currentMark = 'O';
      } else {
        currentMark = 'X';
      }
    };

    const displayInConsole = () => {
      for (let i = 0; i < _board.length; i += 3) {
        console.log(`${_board[i]} || ${_board[i+1]} || ${_board[i+2]}`)
      }
    };

    const displayOnPage = () => {

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
    };

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
    };

    const announceWinner = (mark) => {
      console.log(`${mark} wins!`);
      const announcement = document.createElement('H1');
      announcement.innerText = `${mark} wins!`;
      document.body.appendChild(announcement);
      playerHasWon = true;

    };

    const generateWinningLines = (BOARD_DIMENTIONS) => {
      // write algorithm for generating lines
    };

    DOMGameboard.addEventListener('mousedown', (event) => {
      if (event.target.tagName !== 'TD') {
        return;
      }

      if (playerHasWon) {
        return;
      }

      const clickedCell = event.target;
      const clickedRow = clickedCell.parentNode;
      
      const rowIndex = Array.from(DOMGameboard.rows).indexOf(clickedRow);
      const cellIndex = Array.from(clickedRow.cells).indexOf(clickedCell);

      const boardIndex = (rowIndex * BOARD_DIMENTIONS.columns) + cellIndex;
      
      if (_board[boardIndex]) {
        console.log('cell already taken!');
        return;
      }

      const markToPlace = currentMark;
      Gameboard.placeMark(boardIndex);
      Gameboard.displayOnPage();
      if (Gameboard.checkWinner(markToPlace)) {
        Gameboard.announceWinner(markToPlace);
      }

    });

    return {placeMark, displayOnPage, displayInConsole, checkWinner, announceWinner, _board}
  })();

  // === TESTS ===
  //Gameboard.placeMark(3); // places mark
  //Gameboard.placeMark(6); // places mark
  //Gameboard.placeMark(4); // places mark
  //Gameboard.placeMark(7); // places mark
  //Gameboard.placeMark(5); // places mark
  ////Gameboard.displayInConsole(); // does not run
  //Gameboard.displayOnPage(); // runs here and also runs automatically when clicking on cell.
  //console.log(Gameboard.checkWinner === true);// doesn't run
  //console.log('Gameboard.checkWinner');//  also doesn't run
})


