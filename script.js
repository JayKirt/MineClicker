const ROWS = 10;
const COLS = 10;
const MINES = 10;

let board = [];
let revealed = [];

// Create the game board
function createBoard() {
  const boardContainer = document.getElementById("board");
  boardContainer.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    let rowArray = [];
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (let col = 0; col < COLS; col++) {
      let cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.dataset.row = row;
      cellDiv.dataset.col = col;
      cellDiv.addEventListener("click", handleCellClick);
      rowDiv.appendChild(cellDiv);
      rowArray.push({
        mine: false,
        count: 0,
        revealed: false,
      });
    }

    boardContainer.appendChild(rowDiv);
    board.push(rowArray);
    revealed.push(new Array(COLS).fill(false));
  }
}

// Place mines randomly on the board
function placeMines() {
  let minesPlaced = 0;

  while (minesPlaced < MINES) {
    const randomRow = Math.floor(Math.random() * ROWS);
    const randomCol = Math.floor(Math.random() * COLS);

    if (!board[randomRow][randomCol].mine) {
      board[randomRow][randomCol].mine = true;
      minesPlaced++;
    }
  }
}

// Calculate and set the count of adjacent mines for each cell
function calculateCounts() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col].mine) continue;

      let count = 0;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;

          if (
            newRow >= 0 &&
            newRow < ROWS &&
            newCol >= 0 &&
            newCol < COLS &&
            board[newRow][newCol].mine
          ) {
            count++;
          }
        }
      }

      board[row][col].count = count;
    }
  }
}

// Handle cell click event
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (board[row][col].revealed) {
    return;
  }

  revealCell(row, col);
  checkGameStatus();
}

// Reveal the selected cell and neighboring cells recursively
function revealCell(row, col) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS || revealed[row][col]) {
    return;
  }

  revealed[row][col] = true;
  const cell = board[row][col];
  const cellDiv = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

  if (cell.mine) {
    // Game over if a mine is clicked
    cellDiv.classList.add("mine");
    revealAllMines();
    setTimeout(() => {
      alert("Game Over");
      resetGame();
    }, 500);
  } else if (cell.count > 0) {
    // Show the count of adjacent mines
    cellDiv.innerHTML = cell.count;
    cellDiv.classList.add(`count-${cell.count}`);
  } else {
    // Reveal neighboring cells
    revealCell(row - 1, col - 1);
    revealCell(row - 1, col);
    revealCell(row - 1, col + 1);
    revealCell(row, col - 1);
    revealCell(row, col + 1);
    revealCell(row + 1, col - 1);
    revealCell(row + 1, col);
    revealCell(row + 1, col + 1);
  }
}

// Reveal all mines
function revealAllMines() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col].mine) {
        const cellDiv = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cellDiv.classList.add("mine");
      }
    }
  }
}

// Check if the game is won
function checkGameStatus() {
  let revealedCount = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (revealed[row][col]) {
        revealedCount++;
      }
    }
  }

  if (revealedCount === ROWS * COLS - MINES) {
    alert("Congratulations! You won!");
    resetGame();
  }
}

// Reset the game
function resetGame() {
  board = [];
  revealed = [];
  createBoard();
  placeMines();
  calculateCounts();
}

// Initialize the game
function initialize() {
  createBoard();
  placeMines();
  calculateCounts();

  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", resetGame);
}

// Run the initialization
initialize();
