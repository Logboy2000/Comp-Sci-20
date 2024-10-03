var canvas
var ctx

const FPS = 60

const EMPTY_CELL_COLOR = '#FFFFFF';
const PLAYER_ONE_COLOR = '#FF0000';
const PLAYER_TWO_COLOR = '#FFFF00';
const CURSOR_COLOR = '#0000FF';

var currentPlayer = 1

var mouse = {
    x: 0,
    y: 0,
}

var pieceWidth = 50
var pieceHeight = 50
var selectedColumn = 0
/**
 * The current state of the Connect 4 game board.
 * Each element represents a cell on the board.
 * Values in the array mean:
 * - 0: Empty cell
 * - 1: Red piece
 * - 2: Green piece
 */
var board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
]

var emptyBoard = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
]



function go() {
    // Defines canvas
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    canvas.width = pieceWidth * 7
    canvas.height = pieceHeight * 6


    canvas.addEventListener('mousemove', function (event) {
        var rect = canvas.getBoundingClientRect()
        mouse.x = event.clientX - rect.left - 10
        mouse.y = event.clientY - rect.top - 10
    })
    canvas.addEventListener("click", function (event) {
        placePiece(selectedColumn, currentPlayer)
        if (currentPlayer == 1){
            currentPlayer = 2
        } else if (currentPlayer == 2) {
            currentPlayer = 1
        }
    })






    setInterval(update, 1000 / FPS)
}

function update() {
    board[2][0] = 2

    if (mouse.x > 0 && mouse.y > 0 && mouse.x < canvas.width && mouse.y < canvas.height) {
        selectedColumn = Math.floor(mouse.x / pieceWidth)
    }
    document.getElementById('columnDisplay').innerText = selectedColumn
    document.getElementById('turnDisplay').innerText = currentPlayer

    draw()
}
function draw() {
    ctx.globalAlpha = 1.0
    ctx.fillStyle = '#0000FF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    ctx.fillStyle = '#FF0000'
    //Draw board
    drawBoard()



    // Draw Selected Column
    ctx.globalAlpha = 0.5
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(selectedColumn * pieceWidth, 0, pieceWidth, canvas.height)

    //Draw Mouse Position
    ctx.fillStyle = '#000000'
    drawCircle(mouse.x, mouse.y, 5)
}
function drawCircle(x = 0, y = 0, radius = 10, fill = true) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    if (fill) {
        ctx.fill()
    } else {
        ctx.stroke()
    }
}
function drawBoard() {
    for (x = 0; x < board.length; x++) {
        for (y = 0; y < board[0].length; y++) {
            switch (board[x][y]) {
                case 0:
                    ctx.fillStyle = EMPTY_CELL_COLOR;
                    break;
                case 1:
                    ctx.fillStyle = PLAYER_ONE_COLOR;
                    break;
                case 2:
                    ctx.fillStyle = PLAYER_TWO_COLOR;
                    break;
            }
            drawCircle((x * pieceWidth) + (pieceWidth / 2), (y * pieceHeight) + (pieceHeight / 2), pieceWidth / 2)

        }
    }
}


function pushDown() {
    for (x = 0; x < board.length; x++) {
        for (y = 0; y < board[0].length; y++) {
            while (board[x][y] + 1 == 0) {
                board[x][y + 1] = board[x][y]
                board[x][y] = 0
            }
        }
    }
}
function placePiece(column, player) {
    board[column][0] = player
}

function clearBoard() {
    board = emptyBoard
}

