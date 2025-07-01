document.addEventListener('DOMContentLoaded', () => {

  const Gameboard = (() => {
    const _BOARD_DIMENSIONS = {rows: 3, columns: 3};
    const _board = new Array(_BOARD_DIMENSIONS.rows * _BOARD_DIMENSIONS.columns);
    const _DOMBoard = document.querySelector('.gameboard'); // Moved DOMBoard here for encapsulation
        
    const placeMark = (square, mark) => {
      _board[square] = mark;
    }

    const displayOnPage = () => {
      if (!_DOMBoard || !_DOMBoard.rows) {
          console.error("DOM board element not found or not structured as a table.");
          return;
      }
      let boardIndex = 0;
      for (let i = 0; i < _BOARD_DIMENSIONS.rows; i++) {
        const row = _DOMBoard.rows[i];
        if (!row) continue;
        const cells = row.cells;

        for (let j = 0; j < _BOARD_DIMENSIONS.columns; j++) {
          const cell = cells[j];
          if (!cell) continue;

          cell.textContent = _board[boardIndex] || '';
          boardIndex++;
        }
      }
    }

    const getMark = (square) => {
      return _board[square];
    }

    const reset = () => {
      _board.fill(undefined);
      displayOnPage();
    }

    const isFull = () => {
      return !_board.includes(undefined);
    }

    const setVisibility = (visible) => {
        // Correctly apply display: none or '' (default/block)
        _DOMBoard.style.display = visible ? '' : 'none';
    };

    // Public API for Gameboard
    return {
      getMark,
      placeMark,
      isFull,
      displayOnPage,
      reset,
      setVisibility,
      _DOMBoard: _DOMBoard, // Expose for GameController's event listener attachment
      _BOARD_DIMENSIONS: _BOARD_DIMENSIONS // Expose for GameController's calculation
    };
  })();


  function CreatePlayer(name, mark) {
    return {name, mark};
  }


  const GameController = (() => {
    const _players = [];
    let _currentPlayerIndex = 0;
    let _playerHasWon = false;
    let _isDraw = false;
    let _gameStarted = false; // Flag to indicate if game logic should run

    const handleCellClick = (event) => {
        // Prevent moves if game hasn't started or is already over
        if (!_gameStarted || _playerHasWon || _isDraw) {
            return;
        }

        if (event.target.tagName !== 'TD') {
            return;
        }

        const clickedCell = event.target;
        const clickedRow = clickedCell.parentNode;
        
        // Use Gameboard's exposed _DOMBoard and _BOARD_DIMENSIONS for calculations
        const rowIndex = Array.from(Gameboard._DOMBoard.rows).indexOf(clickedRow);
        const cellIndex = Array.from(clickedRow.cells).indexOf(clickedCell);
        const boardIndex = (rowIndex * Gameboard._BOARD_DIMENSIONS.columns) + cellIndex;
        
        if (Gameboard.getMark(boardIndex)) {
            console.log('Cell already taken!');
            return;
        }

        const currentPlayer = _players[_currentPlayerIndex];
        Gameboard.placeMark(boardIndex, currentPlayer.mark);
        Gameboard.displayOnPage();

        if (checkWinner(currentPlayer.mark)) {
            announceWinner(currentPlayer.name);
        } else if (Gameboard.isFull()) {
            announceDraw();
        } else {
            switchTurns();
        }
    };


    const checkWinner = (markToCheck) => {
      const winningLines = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6]];

      for (let i = 0; i < winningLines.length; i++) {
        const lineIndices = winningLines[i];
        const boardValuesOnLine = [];

        for (let j = 0; j < lineIndices.length; j++) {
          boardValuesOnLine.push(Gameboard.getMark(lineIndices[j]));
        }

        if (boardValuesOnLine.every((value) => value === markToCheck)) {
          _playerHasWon = true;
          return true;
        }
      }
      return false;
    }

    const announceWinner = (playerName) => {
      console.log(`${playerName} has won!`);
      const announcement = document.createElement('H1');
      announcement.innerText = `${playerName} wins!`;
      document.body.appendChild(announcement);
      
      Gameboard._DOMBoard.removeEventListener('mousedown', handleCellClick); // Use Gameboard's exposed _DOMBoard
    }

    const announceDraw = () => {
      console.log('Draw');
      const announcement = document.createElement('H1');
      announcement.innerText = 'It\'s a Draw!';
      document.body.appendChild(announcement);

      _isDraw = true;
      Gameboard._DOMBoard.removeEventListener('mousedown', handleCellClick); // Use Gameboard's exposed _DOMBoard
    }

    const switchTurns = () => {
      _currentPlayerIndex = 1 - _currentPlayerIndex;
      console.log(`It's ${_players[_currentPlayerIndex].name}'s turn (${_players[_currentPlayerIndex].mark})`);
    }

    const initGame = (player1Name, player2Name) => {
        _players.length = 0; // Clear previous players
        _players.push(CreatePlayer(player1Name, 'X'));
        _players.push(CreatePlayer(player2Name, 'O'));

        _currentPlayerIndex = 0;
        _playerHasWon = false;
        _isDraw = false;
        _gameStarted = true; // Crucial: Game is now ready to start

        Gameboard.reset(); // Reset and display empty board
        Gameboard.setVisibility(true); // Make board visible

        Gameboard._DOMBoard.addEventListener('mousedown', handleCellClick); // Use Gameboard's exposed _DOMBoard

        console.log(`Game started! ${_players[_currentPlayerIndex].name}'s turn (${_players[_currentPlayerIndex].mark})`);
    };

    return {
      initGame
    };
  })();

  // --- Initial Setup (when DOMContentLoaded fires) ---
  Gameboard.setVisibility(false); // Hide the board initially

  const playerForm = document.querySelector('#player-form');
  if (playerForm) {
    playerForm.addEventListener('submit', (event) => {
      event.preventDefault(); // <<< --- FIX: Prevent default form submission (page reload)
      const playerXName = playerForm.querySelector('#playerX').value || 'Player X';
      const playerOName = playerForm.querySelector('#playerO').value || 'Player O';
      
      GameController.initGame(playerXName, playerOName); // Initialize and start the game
      playerForm.style.display = 'none'; // Hide the form after submission
    });
  }

});
