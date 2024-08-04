document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const tiles = Array.from(document.getElementsByClassName('tile'));
    const maxTileDisplay = document.getElementById('max-tile');
    const registerForm = document.getElementById('register-form');
    const usernameInput = document.getElementById('username');
    const playersList = document.getElementById('players-list');
    let boardArray = new Array(16).fill(0);
    let maxTile = 0;
    let currentUser = null;
    let currentMaxTile = 0;

    function initializeGame() {
        boardArray.fill(0);
        addNewTile();
        addNewTile();
        updateBoard();
        maxTile = currentMaxTile;  // Set max tile to current max tile for the user
        updateMaxTileDisplay();
    }

    function addNewTile() {
        let emptyTiles = boardArray.reduce((acc, val, index) => val === 0 ? acc.concat(index) : acc, []);
        if (emptyTiles.length > 0) {
            let newTileIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            boardArray[newTileIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function updateBoard() {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].textContent = boardArray[i] === 0 ? '' : boardArray[i];
            tiles[i].style.backgroundColor = getTileColor(boardArray[i]);
        }
        updateMaxTile();
    }

    function getTileColor(value) {
        switch (value) {
            case 0: return '#cdc1b4';
            case 2: return '#eee4da';
            case 4: return '#ede0c8';
            case 8: return '#f2b179';
            case 16: return '#f59563';
            case 32: return '#f67c5f';
            case 64: return '#f65e3b';
            case 128: return '#edcf72';
            case 256: return '#edcc61';
            case 512: return '#edc850';
            case 1024: return '#edc53f';
            case 2048: return '#edc22e';
            default: return '#3c3a32';
        }
    }

    function slide(row) {
        let arr = row.filter(val => val);
        let missing = 4 - arr.length;
        let zeros = Array(missing).fill(0);
        arr = arr.concat(zeros);
        return arr;
    }

    function combine(row) {
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1] && row[i] !== 0) {
                row[i] *= 2;
                row[i + 1] = 0;
            }
        }
        return row;
    }

    function moveLeft() {
        for (let i = 0; i < 16; i += 4) {
            let row = boardArray.slice(i, i + 4);
            row = slide(row);
            row = combine(row);
            row = slide(row);
            for (let j = 0; j < 4; j++) {
                boardArray[i + j] = row[j];
            }
        }
    }

    function moveRight() {
        for (let i = 0; i < 16; i += 4) {
            let row = boardArray.slice(i, i + 4);
            row.reverse();
            row = slide(row);
            row = combine(row);
            row = slide(row);
            row.reverse();
            for (let j = 0; j < 4; j++) {
                boardArray[i + j] = row[j];
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let column = [boardArray[i], boardArray[i + 4], boardArray[i + 8], boardArray[i + 12]];
            column = slide(column);
            column = combine(column);
            column = slide(column);
            for (let j = 0; j < 4; j++) {
                boardArray[i + j * 4] = column[j];
            }
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let column = [boardArray[i], boardArray[i + 4], boardArray[i + 8], boardArray[i + 12]];
            column.reverse();
          column = slide(column);
          column = combine(column);
          column = slide(column);
          column.reverse();
          for (let j = 0; j < 4; j++) {
              boardArray[i + j * 4] = column[j];
          }
      }
  }

  function handleKeyPress(event) {
      switch (event.key) {
          case 'ArrowLeft':
              moveLeft();
              break;
          case 'ArrowRight':
              moveRight();
              break;
          case 'ArrowUp':
              moveUp();
              break;
          case 'ArrowDown':
              moveDown();
              break;
          default:
              return;
      }
      addNewTile();
      updateBoard();
      checkGameOver();
  }

  function updateMaxTile() {
      const currentMaxTile = Math.max(...boardArray);
      if (currentMaxTile > maxTile) {
          maxTile = currentMaxTile;
      }
      updateMaxTileDisplay();
  }

  function updateMaxTileDisplay() {
      maxTileDisplay.textContent = `가장 큰 수: ${maxTile}`;
  }

  function checkGameOver() {
      if (!boardArray.includes(0)) {
          alert('남은 칸이 없습니다! \n리셋 후 게임이 다시 시작됩니다.');
          if (currentUser) {
              savePlayer(currentUser, maxTile);
          }
          initializeGame();
      }
  }

  function savePlayer(name, maxTile) {
      let players = JSON.parse(localStorage.getItem('players')) || [];
      let player = players.find(p => p.name === name);
      if (player) {
          if (maxTile > player.maxTile) {
              player.maxTile = maxTile;
          }
      } else {
          players.push({ name, maxTile });
      }
      localStorage.setItem('players', JSON.stringify(players));
      displayPlayers();
  }

  function displayPlayers() {
      let players = JSON.parse(localStorage.getItem('players')) || [];
      playersList.innerHTML = '';
      players.sort((a, b) => b.maxTile - a.maxTile);
      players.forEach(player => {
          let li = document.createElement('li');
          li.textContent = `${player.maxTile}: ${player.name}`;
          playersList.appendChild(li);
      });
  }

  registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let username = usernameInput.value.trim();
      if (username) {
          currentUser = username;
          let players = JSON.parse(localStorage.getItem('players')) || [];
          let player = players.find(p => p.name === username);
          if (player) {
              maxTile = player.maxTile;
              updateMaxTileDisplay();
          }
          usernameInput.value = '';
          alert("한 기기당 한번씩 밖에 계정을 못만듭니다!")
      }
  });

  document.addEventListener('keydown', handleKeyPress);
  initializeGame();
  displayPlayers();
});
