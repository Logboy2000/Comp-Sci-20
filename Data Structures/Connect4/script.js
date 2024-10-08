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
    '#FF7F00', // Orange
    '#4B0082', // Indigo
    '#000000', // Black
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
    '#800080', // Purple
    '#008000', // Dark Green
    '#000080', // Navy
    '#800000', // Maroon
    '#808000', // Olive
    '#008080', // Teal
    '#FFC0CB', // Pink
    '#FFD700', // Gold
    '#C0C0C0', // Silver
    '#808080', // Gray
    '#A52A2A', // Brown
    '#DEB887', // Burlywood
    '#FF69B4', // Hot Pink
    '#7FFF00', // Chartreuse
    '#D2691E', // Chocolate
    '#FF7F50', // Coral
    '#6495ED', // Cornflower Blue
    '#DC143C', // Crimson
    '#00008B', // Dark Blue
    '#008B8B', // Dark Cyan
    '#B8860B', // Dark Goldenrod
    '#A9A9A9', // Dark Gray
    '#006400', // Dark Green
    '#BDB76B', // Dark Khaki
    '#8B008B', // Dark Magenta
    '#556B2F', // Dark Olive Green
    '#FF8C00', // Dark Orange
    '#9932CC', // Dark Orchid
    '#8B0000', // Dark Red
    '#E9967A', // Dark Salmon
    '#8FBC8F', // Dark Sea Green
    '#483D8B', // Dark Slate Blue
    '#2F4F4F', // Dark Slate Gray
    '#00CED1', // Dark Turquoise
    '#9400D3', // Dark Violet
    '#FF1493', // Deep Pink
    '#00BFFF', // Deep Sky Blue
    '#696969', // Dim Gray
    '#1E90FF', // Dodger Blue
    '#B22222', // Firebrick
    '#228B22', // Forest Green
    '#FF00FF', // Fuchsia
    '#DCDCDC', // Gainsboro
    '#F8F8FF', // Ghost White
    '#FFD700', // Gold
    '#DAA520', // Goldenrod
    '#808080', // Gray
    '#ADFF2F', // Green Yellow
    '#F0FFF0', // Honeydew
    '#FF69B4', // Hot Pink
    '#CD5C5C', // Indian Red
    '#4B0082', // Indigo
    '#FFFFF0', // Ivory
    '#F0E68C', // Khaki
    '#E6E6FA', // Lavender
    '#FFF0F5', // Lavender Blush
    '#7CFC00', // Lawn Green
    '#FFFACD', // Lemon Chiffon
    '#ADD8E6', // Light Blue
    '#F08080', // Light Coral
    '#E0FFFF', // Light Cyan
    '#FAFAD2', // Light Goldenrod Yellow
    '#D3D3D3', // Light Gray
    '#90EE90', // Light Green
    '#FFB6C1', // Light Pink
    '#FFA07A', // Light Salmon
    '#20B2AA', // Light Sea Green
    '#87CEFA', // Light Sky Blue
    '#778899', // Light Slate Gray
    '#B0C4DE', // Light Steel Blue
    '#FFFFE0', // Light Yellow
    '#00FF00', // Lime
    '#32CD32', // Lime Green
    '#FAF0E6', // Linen
    '#FF00FF', // Magenta
    '#800000', // Maroon
    '#66CDAA', // Medium Aquamarine
    '#0000CD', // Medium Blue
    '#BA55D3', // Medium Orchid
    '#9370DB', // Medium Purple
    '#3CB371', // Medium Sea Green
    '#7B68EE', // Medium Slate Blue
    '#00FA9A', // Medium Spring Green
    '#48D1CC', // Medium Turquoise
    '#C71585', // Medium Violet Red
    '#191970', // Midnight Blue
    '#F5FFFA', // Mint Cream
    '#FFE4E1', // Misty Rose
    '#FFE4B5', // Moccasin
    '#FFDEAD', // Navajo White
    '#000080', // Navy
    '#FDF5E6', // Old Lace
    '#808000', // Olive
    '#6B8E23', // Olive Drab
    '#FFA500', // Orange
    '#FF4500', // Orange Red
    '#DA70D6', // Orchid
    '#EEE8AA', // Pale Goldenrod
    '#98FB98', // Pale Green
    '#AFEEEE', // Pale Turquoise
    '#DB7093', // Pale Violet Red
    '#FFEFD5', // Papaya Whip
    '#FFDAB9', // Peach Puff
    '#CD853F', // Peru
    '#FFC0CB', // Pink
    '#DDA0DD', // Plum
    '#B0E0E6', // Powder Blue
    '#800080', // Purple
    '#663399', // Rebecca Purple
    '#FF0000', // Red
    '#BC8F8F', // Rosy Brown
    '#4169E1', // Royal Blue
    '#8B4513', // Saddle Brown
    '#FA8072', // Salmon
    '#F4A460', // Sandy Brown
    '#2E8B57', // Sea Green
    '#FFF5EE', // Seashell
    '#A0522D', // Sienna
    '#C0C0C0', // Silver
    '#87CEEB', // Sky Blue
    '#6A5ACD', // Slate Blue
    '#708090', // Slate Gray
    '#FFFAFA', // Snow
    '#00FF7F', // Spring Green
    '#4682B4', // Steel Blue
    '#D2B48C', // Tan
    '#008080', // Teal
    '#D8BFD8', // Thistle
    '#FF6347', // Tomato
    '#40E0D0', // Turquoise
    '#EE82EE', // Violet
    '#F5DEB3', // Wheat
    '#FFFFFF', // White
    '#F5F5F5', // White Smoke
    '#FFFF00', // Yellow
    '#9ACD32',  // Yellow Green
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

var emptyBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
]



//Sound effects
var sndFloorHit = new Audio('Audio/hit.mp3')
var sndDrop = new Audio('Audio/drop.mp3')
var sndDraw = new Audio('Audio/rizz.mp3')
var sndWin = new Audio('Audio/win.mp3')

function go() {
    
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
}

function update() {



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


}

function updatePlaying() {
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
    draw()

}
var animatedPiece = {
    x: 0,
    y: 0,
    targetY: 0,
}
function updatePieceFalling() {
    document.getElementById('gameCanvas').style.cursor = 'default'
    draw()
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
}

function updateEnd() {
    document.getElementById('gameCanvas').style.cursor = 'pointer'
    // Draws board in background
    draw()

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
    
}
function draw() {
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

}
function drawCircle(x = 0, y = 0, radius = 10, fill = true, piMult = 2) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, piMult * Math.PI)
    if (fill) {
        ctx.fill()
    } else {
        ctx.stroke()
    }
}
function placePiece(row, column, player) {
    if (board[column][row] == 0) {
        gameState = gameStates.PIECE_FALLING
        animatedPiece.y = -pieceHeight
        sndDrop.cloneNode().play()
    }

}
function newGame() {
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
    //canvas.width = pieceWidth * emptyBoard.length
    //canvas.height = pieceHeight * emptyBoard[0].length
    playerTurn = 1
    gameState = gameStates.PLAYING
    resizeCanvas()
}



function copyArray(copiedArray) {
    var outputArray = []
    var i
    for (i = 0; i < copiedArray.length; i++) {
        outputArray[i] = copiedArray[i]
    }
    return outputArray
}
/**
 * Checks for a sequence of 'winLength' connected pieces in all directions.
 * Returns the player number if a winner is found, or 0 if no winner is found.
 */
function checkWin() {
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
}
function checkDraw() {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] == 0) {
                return false
            }
        }
    }
    return true
}


function toggleFullscreen() {
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
}

function resizeCanvas() {
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
    
}

// Add event listener for fullscreenchange
document.addEventListener('fullscreenchange', resizeCanvas);