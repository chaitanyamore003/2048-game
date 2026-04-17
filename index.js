var board;
var score = 0;
var rows = 4;
var columns = 4;

let bestScore = localStorage.getItem("bestScore") || 0;
document.getElementById("best-score").innerText = bestScore;

// Initialize game on page load
window.onload = () => setGame();

document.getElementById("new-game").addEventListener("click", () => {
    startNewGame();
});

function startNewGame() {
    score = 0;
    updateScore();

    // reset board
    board = Array.from({ length: rows }, () => Array(columns).fill(0));

    // clear UI
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            updateTile(
                document.getElementById(`${r}-${c}`),
                0
            );
        }
    }

    // add initial tiles
    setTwo();
    setTwo();
}

// Update score in UI
function updateScore() {
    let displayScore = document.getElementById("score");
    displayScore.innerText = score;

    // update best score
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("best-score").innerText = bestScore;
    }
}

// Initialize empty board and UI
const setGame = () => {
    board = Array.from({ length: rows }, () => Array(columns).fill(0));

    // Create grid UI dynamically
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            updateTile(tile, board[r][c]);
            document.getElementById("board").append(tile);
        }
    }

    // Add initial tiles
    setTwo();
    setTwo();
}

// Check if any empty cell exists
function hasEmptyTile() {
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            if (board[r][c] === 0) return true;
        }
    }
    return false;
}

// Place a random '2' tile on empty position
function setTwo() {
    if (!hasEmptyTile()) return; // ✅ fixed bug

    let found = false;

    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] === 0) {
            board[r][c] = 2;

            let tile = document.getElementById(`${r}-${c}`);
            updateTile(tile, 2);

            found = true;
        }
    }
}

// Update tile UI based on value
const updateTile = (tile, num) => {
    tile.innerText = "";
    tile.className = "tile"; // reset class

    if (num > 0) {
        tile.innerText = num;
        tile.classList.add(num <= 4096 ? `x${num}` : "x8192");
    }
}

// Keyboard controls
document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code === "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code === "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code === "ArrowDown") {
        slideDown();
        setTwo();
    }
});

// Remove zeros from row
function filterZero(row) {
    return row.filter(num => num !== 0);
}

// Core sliding + merging logic (DSA core)
function slide(row) {
    row = filterZero(row);

    // Merge adjacent equal elements
    for (var i = 1; i < row.length; i++) {
        if (row[i] === row[i - 1]) {
            row[i - 1] *= 2;
            row[i] = 0;
            score += row[i - 1];
        }
    }

    row = filterZero(row);

    // Pad with zeros
    while (row.length < columns) {
        row.push(0);
    }

    updateScore();
    return row;
}

// Slide left
function slideLeft() {
    for (var r = 0; r < rows; r++) {
        board[r] = slide(board[r]);

        for (var c = 0; c < columns; c++) {
            updateTile(
                document.getElementById(`${r}-${c}`),
                board[r][c]
            );
        }
    }
}

// Slide right
function slideRight() {
    for (var r = 0; r < rows; r++) {
        let row = board[r].slice().reverse();
        row = slide(row).reverse();
        board[r] = row;

        for (var c = 0; c < columns; c++) {
            updateTile(
                document.getElementById(`${r}-${c}`),
                board[r][c]
            );
        }
    }
}

// Slide up (treat column as row)
function slideUp() {
    for (var c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);

        for (var r = 0; r < rows; r++) {
            board[r][c] = row[r];
        }
    }

    updateBoardUI();
}

// Slide down
function slideDown() {
    for (var c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row.reverse()).reverse();

        for (var r = 0; r < rows; r++) {
            board[r][c] = row[r];
        }
    }

    updateBoardUI();
}

// Re-render entire board
function updateBoardUI() {
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            updateTile(
                document.getElementById(`${r}-${c}`),
                board[r][c]
            );
        }
    }
}
