var canvas
var ctx

const FPS = 60

const EMPTY_CELL_COLOR = '#FFFFFF';
const PLAYER_ONE_COLOR = '#FF0000';
const PLAYER_TWO_COLOR = '#00FF00';
const CURSOR_COLOR = '#0000FF';

var players = {
    red: 0,
    yellow: 0
}

var currentPlayer = 1

var mouse = {
    x: 0,
    y: 0,
}

var pieceWidth = 50
var pieceHeight = 50

/**
 * The current state of the Connect 4 game board.
 * Each element represents a cell on the board.
 * Values in the array mean:
 * - 0: Empty cell
 * - 1: Red piece
 * - 2: Green piece
 */
var board = [
    [1, 1, 0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 2],
    [1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 2, 1, 0],
    [1, 1, 1, 1, 1, 1, 2]
]
var selectedColumn = 0

function go() {
    // Defines canvas
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    canvas.width = pieceWidth * 7
    canvas.height = pieceHeight * 7


      canvas.addEventListener('mousemove', function(event) {
          var rect = canvas.getBoundingClientRect()
          mouse.x = event.clientX - rect.left - 10
          mouse.y = event.clientY - rect.top - 10
      })






    setInterval(update, 1000 / FPS)
}

function update() {

    if (mouse.x > 0 && mouse.y > 0 && mouse.x < canvas.width && mouse.y < canvas.height) {
        selectedColumn = Math.floor(mouse.x / pieceWidth)
    }
    console.log(selectedColumn)

    draw()
}
function draw() {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    ctx.fillStyle = '#FF0000'
    //Draw board
    drawBoard()


    ctx.fillStyle = '#000000'
    drawCircle(mouse.x, mouse.y, 10)


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
            ctx.fillRect(y * pieceHeight, (x * pieceWidth) + pieceHeight, pieceWidth, pieceHeight)

        }
    }
}