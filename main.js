const SIZE = 12
const MINES = 8
let board = []
let gameOver = false

initGame()

function initGame() {
    board = createBoard()
    placeMines()
    calculateMinesAround()
    renderBoard()
    gameOver = false
    document.getElementById('status').textContent = '😃'
}

function createBoard() {
    let b = []
    for (let i = 0; i < SIZE; i++) {
        b[i] = []
        for (let j = 0; j < SIZE; j++) {
            b[i][j] = {
                isMine: false,
                isRevealed: false,
                isMarked: false,
                minesAround: 0
            }
        }
    }
    return b
}

function placeMines() {
    let placed = 0
    while (placed < MINES) {
        let i = Math.floor(Math.random() * SIZE)
        let j = Math.floor(Math.random() * SIZE)
        if (board[i][j].isMine === false) {
            board[i][j].isMine = true
            placed = placed + 1
        }
    }
}

function calculateMinesAround() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j].isMine === false) {
                let count = 0
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        let ni = i + x
                        let nj = j + y
                        if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE) {
                            if (board[ni][nj].isMine === true) {
                                count = count + 1
                            }
                        }
                    }
                }
                board[i][j].minesAround = count
            }
        }
    }
}

function renderBoard() {
    let table = document.getElementById('board')
    table.innerHTML = ''
    for (let i = 0; i < SIZE; i++) {
        let row = table.insertRow()
        for (let j = 0; j < SIZE; j++) {
            let cell = row.insertCell()
            cell.className = 'covered'
            cell.onclick = function () {
                onCellClick(i, j)
            }
            cell.oncontextmenu = function (e) {
                e.preventDefault()
                onCellRightClick(i, j)
            }
        }
    }
}

function onCellClick(i, j) {
    if (gameOver === true) {
        return
    }
    if (board[i][j].isMarked === true) {
        return
    }
    if (board[i][j].isRevealed === true) {
        return
    }

    let cell = board[i][j]
    cell.isRevealed = true
    let tableCell = document.getElementById('board').rows[i].cells[j]
    tableCell.classList.remove('covered')
    tableCell.classList.add('revealed')

    if (cell.isMine === true) {
        tableCell.textContent = '☠️'
        document.getElementById('status').textContent = '😵'
        revealMines()
        gameOver = true
    } else {
        if (cell.minesAround > 0) {
            tableCell.textContent = cell.minesAround
        }
        if (cell.minesAround === 0) {
            expandReveal(i, j)
        }
    }


    checkWin()
}

function onCellRightClick(i, j) {
    if (gameOver === true) {
        return
    }
    if (board[i][j].isRevealed === true) {
        return
    }

    let cell = board[i][j]
    let tableCell = document.getElementById('board').rows[i].cells[j]
    if (cell.isMarked === false) {
        cell.isMarked = true
        tableCell.classList.add('marked')
        tableCell.textContent = '🚩'
    } else {
        cell.isMarked = false
        tableCell.classList.remove('marked')
        tableCell.textContent = ''
    }
}

function revealMines() {
    let table = document.getElementById('board')
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) { // Fixed missing semicolons
            if (board[i][j].isMine === true) {
                table.rows[i].cells[j].classList.add('mine')
            }
        }
    }
}

function expandReveal(i, j) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            let ni = i + x
            let nj = j + y
            if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE) {
                if (board[ni][nj].isRevealed === false) {
                    onCellClick(ni, nj)
                }
            }
        }
    }
}

document.getElementById('restart').onclick = function () {
    initGame()
}

function checkWin() {
    let win = true
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (!board[i][j].isRevealed && !board[i][j].isMine) {
                win = false
                break
            }
        }
        if (!win) break
    }

    if (win) {
        document.getElementById('status').textContent = 'Congratulations you win! 🏆'
        gameOver = true
    }
}