var canvas
var ctx
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

const FPS = 60

// The following color list is brought to you by ChatGPT.
const PLAYER_COLORS = [
    '#FFFFFF', // White (used for blank spaces)
    '#FF0000', // Red
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#9400D3', // Violet
]


const gameStates = {
    PLAYING: 0,
    PIECE_FALLING: 1,
    END: 2
}

var gameState = gameStates.PLAYING
var isDraw = false

var playerTurn = 1


//Settings
var winLength = 4
var playerCount = 2
var animatedPieceFallSpeed = 10
var useSFX = false
var boardWidth = 6
var boardHeight = 7

var mouse = {
    x: 0,
    y: 0,
}

var pieceWidth = 50
var pieceHeight = 50
const defaultPieceWidth = 50
const defaultPieceHeight = 50

var selectedColumn = 0
var selectedRow = 5

var boardXOffset = 0

/**
 * 0 = Empty cell
 * 1-4 = Players 1-4
**/
var board = []

var emptyBoard = []



//Sound effects
var sndFloorHit = new Audio('Audio/hit.mp3')
var sndDrop = new Audio('Audio/drop.mp3')
var sndDraw = new Audio('Audio/rizz.mp3')
var sndWin = new Audio('Audio/win.mp3')

function go() { // Start of go
    
    // Adds all player options to dropdown
    const playerCount = document.getElementById('playerCount')
    for (var i = 1; i < PLAYER_COLORS.length; i++) {

        var option = document.createElement('option')
        option.value = i
        option.text = i
        playerCount.appendChild(option)
    }
    playerCount.value = 2


    // Defines canvas
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')

    // Defines board
    newGame()



    // Get Mouse Position
    canvas.addEventListener('mousemove', function (event) {
        var rect = canvas.getBoundingClientRect()
        var scaleX = canvas.width / rect.width
        var scaleY = canvas.height / rect.height
        mouse.x = (event.clientX - rect.left) * scaleX - boardXOffset
        mouse.y = (event.clientY - rect.top) * scaleY
    })
    // Get Mouse Click
    canvas.addEventListener("click", function (event) {
        if (gameState == gameStates.PLAYING) {
            placePiece(selectedRow, selectedColumn, playerTurn)
        } else if (gameState == gameStates.END){
            newGame()
        }
    })
    // Start game loop
    setInterval(update, 1000 / FPS)
}// End of go

function update() { // Start of update



    switch (gameState) {
        case gameStates.PLAYING:
            updatePlaying()
            break
        case gameStates.PIECE_FALLING:
            updatePieceFalling()
            break
        case gameStates.END:
            updateEnd()
            break
    }


}// End of update

function updatePlaying() { // Start of updatePlaying
    document.getElementById('gameCanvas').style.cursor = 'pointer'

    // Update selected column and row
    if (mouse.x > 0 && mouse.y > 0 && mouse.x < canvas.width && mouse.y < canvas.height) {
        selectedColumn = Math.floor(mouse.x / pieceWidth)
        selectedRow = board[0].length - 1
        while (board[selectedColumn][selectedRow] !== 0) {
            selectedRow -= 1
            if (selectedRow < 0) break; // Prevent going out of bounds
        }
    }
    drawBoard()

}// End of updatePlaying
var animatedPiece = {
    x: 0,
    y: 0,
    targetY: 0,
}
function updatePieceFalling() { // Start of updatePieceFalling
    document.getElementById('gameCanvas').style.cursor = 'default'
    drawBoard()
    // Update animated piece
    animatedPiece.x = (selectedColumn * pieceWidth) + boardXOffset + pieceWidth / 2,
        animatedPiece.targetY = (selectedRow * pieceHeight) + (pieceHeight / 2)
    animatedPiece.y += animatedPieceFallSpeed
    ctx.fillStyle = PLAYER_COLORS[playerTurn]
    if (animatedPiece.y >= animatedPiece.targetY) {
        animatedPiece.y = animatedPiece.targetY
        gameState = gameStates.PLAYING
        board[selectedColumn][selectedRow] = playerTurn
        sndFloorHit.cloneNode().play()





        // Check for a winner
        if (checkWin() != 0) {
            gameState = gameStates.END
            isDraw = false
            sndWin.cloneNode().play()
            return
        }
        if (checkDraw()) {
            gameState = gameStates.END
            isDraw = true
            sndDraw.cloneNode().play()
            return
        }

        playerTurn += 1
        if (playerTurn > playerCount) { playerTurn = 1 }


    }
    ctx.globalAlpha = 1.0
    drawCircle(animatedPiece.x, animatedPiece.y, pieceWidth / 2)
} // End of updatePieceFalling

function updateEnd() {// Start of updateEnd
    document.getElementById('gameCanvas').style.cursor = 'pointer'
    // Draws board in background
    drawBoard()

    // Draws black circle in middle of canvas
    ctx.globalAlpha = 0.5
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Change font size based on canvas size
    ctx.globalAlpha = 1.0
    ctx.font = '25px smw'
    ctx.textAlign = 'center'
    // Sets text depending on if it's a draw or not
    var text = ''
    if (isDraw) {
        ctx.fillStyle = '#FFFFFF'
        text = 'Draw!'
    } else {
        ctx.fillStyle = PLAYER_COLORS[playerTurn]
        text = 'Player ' + playerTurn + ' Wins!'
    }
    // Draws Text Outline
    ctx.lineWidth = 5
    ctx.strokeStyle = '#000000'
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2)
    ctx.strokeText('Click to play again', canvas.width / 2, canvas.height-25)
    // Draws Text
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    ctx.fillText('Click to play again', canvas.width / 2, canvas.height-25)
    
}// End of updateEnd
function drawBoard() {// Start of draw
    // Clear Canvas with blue
    ctx.globalAlpha = 1.0
    ctx.fillStyle = '#0000FF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //Draw board pieces
    boardXOffset = (canvas.width / 2) - ((boardWidth * pieceWidth) / 2)
    ctx.globalAlpha = 1.0
    for (x = 0; x < board.length; x++) {
        for (y = 0; y < board[0].length; y++) {
            ctx.fillStyle = PLAYER_COLORS[board[x][y]]
            drawCircle((x * pieceWidth) + (pieceWidth / 2) + boardXOffset, (y * pieceHeight) + (pieceHeight / 2), pieceWidth / 2)

        }
    }


    ctx.globalAlpha = 1
    ctx.fillStyle = PLAYER_COLORS[playerTurn]
    


    if (isMobile == false) {
        // Draw Selected Row & Column
        drawCircle((selectedColumn * pieceWidth) + boardXOffset + pieceWidth / 2, selectedRow * pieceWidth + pieceWidth / 2, pieceWidth / 2)
        ctx.globalAlpha = 0.5
        ctx.fillStyle = '#000000'
        ctx.fillRect((selectedColumn * pieceWidth) + boardXOffset, 0, pieceWidth, selectedRow * pieceWidth + pieceHeight / 2)
        drawCircle((selectedColumn * pieceWidth) + boardXOffset + pieceWidth / 2, selectedRow * pieceWidth + pieceWidth / 2, pieceWidth / 2, true, 1)
    }

}// End of draw
function drawCircle(x = 0, y = 0, radius = 10, fill = true, piMult = 2) { // Start of drawCircle
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, piMult * Math.PI)
    if (fill) {
        ctx.fill()
    } else {
        ctx.stroke()
    }
}// End of drawCircle

function placePiece(row, column) { // Start of placePiece
    if (board[column][row] == 0) {
        gameState = gameStates.PIECE_FALLING
        animatedPiece.y = -pieceHeight
        sndDrop.cloneNode().play()
    }

}// End of placePiece
function newGame() {// Start of newGame
    boardWidth = Number(document.getElementById('boardWidth').value)
    boardHeight = Number(document.getElementById('boardHeight').value)
    playerCount = Number(document.getElementById('playerCount').value)
    winLength = Number(document.getElementById('winLength').value)
    animatedPieceFallSpeed = Number(document.getElementById('animatedPieceFallSpeed').value)
    // Reset board to empty and create new board from boardWidth and boardHeight
    emptyBoard = []
    for (var i = 0; i < boardWidth; i++) {
        emptyBoard[i] = []
        for (var j = 0; j < boardHeight; j++) {
            emptyBoard[i][j] = 0
        }
    }

    board = JSON.parse(JSON.stringify(emptyBoard));
    selectedRow = board[0].length - 1
    playerTurn = 1
    gameState = gameStates.PLAYING
    resizeCanvas()
}// End of newGane



function copyArray(copiedArray) { // start of copyArray
    var outputArray = []
    var i
    for (i = 0; i < copiedArray.length; i++) {
        outputArray[i] = copiedArray[i]
    }
    return outputArray
}// End of copy array
/**
 * Checks for a sequence of 'winLength' connected pieces in all directions.
 * Returns the player number if a winner is found, or 0 if no winner is found.
 */
function checkWin() { //Start of checkWin
    // Check horizontal
    for (var row = 0; row < board[0].length; row++) {
        for (var col = 0; col <= board.length - winLength; col++) {
            if (board[col][row] !== 0) {
                var win = true;
                for (var i = 1; i < winLength; i++) {
                    if (board[col][row] !== board[col + i][row]) {
                        win = false;
                        break;
                    }
                }
                if (win) return board[col][row];
            }
        }
    }

    // Check vertical
    for (var col = 0; col < board.length; col++) {
        for (var row = 0; row <= board[0].length - winLength; row++) {
            if (board[col][row] !== 0) {
                var win = true;
                for (var i = 1; i < winLength; i++) {
                    if (board[col][row] !== board[col][row + i]) {
                        win = false;
                        break;
                    }
                }
                if (win) return board[col][row];
            }
        }
    }

    // Check diagonal (top-left to bottom-right)
    for (var col = 0; col <= board.length - winLength; col++) {
        for (var row = 0; row <= board[0].length - winLength; row++) {
            if (board[col][row] !== 0) {
                var win = true;
                for (var i = 1; i < winLength; i++) {
                    if (board[col][row] !== board[col + i][row + i]) {
                        win = false;
                        break;
                    }
                }
                if (win) return board[col][row];
            }
        }
    }

    // Check diagonal (top-right to bottom-left)
    for (var col = winLength - 1; col < board.length; col++) {
        for (var row = 0; row <= board[0].length - winLength; row++) {
            if (board[col][row] !== 0) {
                var win = true;
                for (var i = 1; i < winLength; i++) {
                    if (board[col][row] !== board[col - i][row + i]) {
                        win = false;
                        break;
                    }
                }
                if (win) return board[col][row];
            }
        }
    }

    // No winner
    return 0;
}// End of checkWin

function checkDraw() { // End of checkDraw
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] == 0) {
                return false
            }
        }
    }
    return true
}// Start of checkDraw


function toggleFullscreen() {// Start of toggleFullscreen
    if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen().then(() => {
                resizeCanvas()
            }).catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                resizeCanvas()
            }).catch((err) => {
                console.error(`Error attempting to exit fullscreen: ${err.message}`);
            });
        }
    }
}// End of toggleFullscreen

function resizeCanvas() {//Start of resizeCanvas
    if (document.fullscreenElement) {//With fullscreen
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        pieceHeight = canvas.height / boardHeight
        pieceWidth = pieceHeight

        // Adjust the width if the board is too wide
        if (pieceWidth * boardWidth > canvas.width) {
            pieceWidth = canvas.width / boardWidth
            pieceHeight = pieceWidth
        }



        canvas.style.border = '#0000BB 0px solid'
    } else {//Without fullscreen
        pieceWidth = defaultPieceWidth
        pieceHeight = defaultPieceHeight
        canvas.width = pieceWidth * boardWidth
        canvas.height = pieceHeight * boardHeight
        canvas.style.border = '#0000BB 10px solid'
    }
    
}// End of resizeCanvas

// Add event listener for fullscreenchange
document.addEventListener('fullscreenchange', resizeCanvas);