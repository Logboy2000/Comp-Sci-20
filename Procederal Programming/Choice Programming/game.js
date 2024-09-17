var canvas
var canvasMiddleX
var canvasMiddleY

var context
var intervalNum
var showDebugInfo = false

const fps = 60

var difficulty

var gameStates = {
	playing: 0,
	gameOver: 1,
	levelComplete: 2,
	difficultySelect: 3,
}

var gameState = gameStates.difficultySelect

var buttonSelected = false

var gameAreaWidth = 500
var gameAreaHeight = 450

var uiAreaHeight = 70

var levelLengthFrames = 30
var levelHits = 10
var level = 1
var timerLevelMultiplier = 0.9
var molePopupTimeLevelMultiplier = 0.9

// Mouse positions
var mouseX = 0
var mouseY = 0

// Stats tracked and shown during the gameplay
var misses = 0
var hits = 0
var escapedMoles = 0

// Stats tracked and shown on the game over screen
var totalHits = 0
var totalMisses = 0
var totalEscapedMoles = 0
var accuracyPercent = 100
var totalClicks = 0

// Timer stuff
const TIMER_DANGER = 0.1 // percentage of time where timer colour changes to danger color
const TIMER_WARN = 0.25 // percentage of time where timer colour changes to warning color

var timerStartFrames = 2000 // The amount of time given at the start of a level
var timeRemainingFrames = 2000 //Tracks the current time remaining
const timerLevel1TotalFrames = 2000 // The amount of time that level 1 starts with (used to reset)
var missPenaltyFrames = 30 // The timer decrease when missing a mole



// Defines how long the "LEVEL COMPLETE" screen is shown
const levelCompleteStartFrames = 120
var levelCompleteFramesRemaining = 120

// Defines how long the "GAME OVER" waits before allowing restart
const gameOverScreenFramesTotal = 240
var gameOverScreenFramesRemaining = 240
var canRestart = false

// Defines all mole properties
var mole = {
	// Current mole transform
	x: 0,
	y: 0,
	w: 150,
	h: 150,
	// Next position
	nextX: 0,
	nextY: 0,
	// Position of the mole's middle
	middleX: 0,
	middleY: 0,
	// Position of the mole's middle at the next position
	nextMiddleX: 0,
	nextMiddleY: 0,
	// Tracks how long the mole stays popped out of the ground
	popupFramesRemaining: 0,
	totalPopupFrames: 100,
}
// Define images
mole.img = new Image()
mole.img.src = "images/mole.png"

bgImg = new Image()
bgImg.src = "images/grass.jpg"


//Define Event listeners
bgImg.onload = start
document.onkeydown = thingPressed
document.onclick = thingPressed


function start() {
	/*
	Inputs: none
	Outputs: none
	*/

	// Canvas and context defined
	canvas = document.getElementById("canvas")
	context = canvas.getContext("2d")

	//Ensures the mole has a random position at the start of the game
	moveMole()

	//Start game update loop with the framerate of 'fps'
	setInterval(update, 1000 / fps)

	// Checks for mouse movement and updates mouseX and mouseY
	canvas.addEventListener("mousemove", function (event) {
		var rect = canvas.getBoundingClientRect()
		mouseX = event.clientX - rect.left
		mouseY = event.clientY - rect.top
	})
}
function update() {
	/*
	Inputs: none
	Outputs: none
	*/
	//Calculates various useful canvas and ui values
	canvasMiddleX = canvas.width / 2
	canvasMiddleY = canvas.height / 2
	gameAreaWidth = canvas.width
	gameAreaHeight = canvas.height - uiAreaHeight

	// Updates canvas size based on window shape & zoom
	canvas.width = canvas.parentNode.clientWidth
	canvas.height = window.innerHeight - 20

	// Determines and runs the correct update method

	switch (gameState) {
		case gameStates.playing:
			gamingDraw()
			gamingUpdate()
			break

		case gameStates.gameOver:
			gameOverDraw()
			gameOverUpdate()
			break

		case gameStates.difficultySelect:
			difficultySelectUpdate()
			break

		case gameStates.levelComplete:
			levelCompleteDraw()
			levelCompleteUpdate()
			break
	}

	//Shows the hitboxes and other debug info
	if (showDebugInfo) {
		drawDebugInfo()
	}


}
function thingPressed() {
	/*
	Inputs: none
	Outputs: none
	*/

	switch (gameState) {
		case gameStates.playing:
			totalClicks += 1
			if (checkMouseCollision(mole.x, mole.y, mole.w, mole.h)) {
				mole.popupFramesRemaining = 0
				hits += 1
				totalHits += 1
				moveMole()
			} else {
				misses += 1
				totalMisses += 1
				timeRemainingFrames -= missPenaltyFrames
			}
			break

		case gameStates.gameOver:
			if (canRestart) { resetGame() }
			break

		case gameStates.difficultySelect:
			if (buttonSelected) { gameState = gameStates.playing }
			break

		case gameStates.levelComplete:

			break
	}





}
function checkMoleCollision(x, y) { // Returns true if the x,y coordinates fall inside the mole"s hitbox
	/*
	Inputs: x, y
	Outputs: true, false
	*/
	if (x >= mole.x && x <= mole.x + mole.w && y >= mole.y && y <= mole.y + mole.h) {
		return true
	}
	return false
}
function checkMouseCollision(x, y, w, h) { // Returns true if the x,y coordinates fall inside the mole"s hitbox 
	/*
	Inputs: x, y, w, h
	Outputs: true, false
	*/


	if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
		return true
	}
	return false
}
function randomRange(min, max) {
	/*
	Inputs: min, max
	Outputs: A random number between the two given values
	*/
	return ((Math.random() * (max - min)) + min)
}






function drawTimer(x, y, w, h, timeRemaining, totalTime, changeColor = false) {
	/*
	Inputs: x, y, w, h, timeRemaining, totalTime, changeColor
	Outputs: none
	*/

	var timeRemainingPercentage = timeRemaining / totalTime
	if (changeColor) {
		if (timeRemainingPercentage < TIMER_DANGER) {
			context.fillStyle = "red"
		} else if (timeRemainingPercentage < TIMER_WARN) {
			context.fillStyle = "orange"
		} else {
			context.fillStyle = "green"
		}
	}
	context.fillRect(x, y, w * (timeRemaining / totalTime), h)
}





function moveMole() {
	/*
	Inputs: none
	Outputs: none
	*/
	mole.x = mole.nextX
	mole.y = mole.nextY
	mole.nextX = randomRange(0, gameAreaWidth - mole.w)
	mole.nextY = randomRange(0, gameAreaHeight - mole.h)
}
function drawLine(x1, y1, x2, y2, thickness, color) {
	/*
	Inputs: x1, y1, x2, y2, thickness, color
	Outputs: none
	*/

	context.fillStyle = color
	// Start a new Path
	context.beginPath()
	context.lineWidth = thickness
	context.moveTo(x1, y1)
	context.lineTo(x2, y2)

	// Draw the Path
	context.stroke();
}
function drawCircle(x, y, radius, color, fill = true, half_circle = false) {
	/*
	Inputs: x, y, radius, color, fill, half_circle
	Outputs: none
	*/

	context.beginPath()
	if (half_circle) {
		context.arc(x, y, radius, 0, 1 * Math.PI)
	} else {
		context.arc(x, y, radius, 0, 2 * Math.PI)
	}
	context.closePath()
	context.fillStyle = color
	if (fill) {
		context.fill()
	} else {
		context.stroke()
	}
}
function resetLevel() {
	/*
	Inputs: none
	Outputs: none
	*/
	// Change difficulty based on level
	mole.totalPopupFrames = Math.pow(molePopupTimeLevelMultiplier, level) * 100
	timerStartFrames = Math.pow(timerLevelMultiplier, level) * timerLevel1TotalFrames

	// Reset Values and move the moleGameOver
	hits = 0
	escapedMoles = 0
	timeRemainingFrames = timerStartFrames
	moveMole()
}
function resetGame() {
	/*
	Inputs: none
	Outputs: none
	*/
	timerStartFrames = timerLevel1TotalFrames
	totalClicks = 0
	totalEscapedMoles = 0
	totalMisses = 0
	totalHits = 0
	accuracyPercent = 0
	gameState = gameStates.difficultySelect
	isDifficultySelect = true
	level = 1
	resetLevel()
}
function gameOverUpdate() {
	/*
	Inputs: none
	Outputs: none
	*/
	// Calculates player accuracy
	accuracyPercent = ((totalHits / totalClicks) * 100).toFixed(2)
	//adds an extra delay to prevent accidental restarting
	gameOverScreenFramesRemaining -= 1
	if (gameOverScreenFramesRemaining <= 0) { canRestart = true }
}
function gameOverDraw() {
	/*
	Inputs: none
	Outputs: none
	*/
	fillCanvas("black", 1.0)

	context.fillStyle = "red"
	context.font = "80px smw"
	context.textAlign = "center"
	context.fillText("GAME OVER", canvasMiddleX, 150)

	context.font = "30px smw"
	if (canRestart) {
		context.fillText("Press Anything to Play Again", canvasMiddleX, canvas.height - 100)
	}
	var gameOverMessage = "Skill issue"
	if (level >= 5) {
		gameOverMessage = "Not bad but still not good"
	}
	if (level >= 10) {
		gameOverMessage = "Honestly pretty good"
	}
	if (level >= 15) {
		gameOverMessage = "wow"
	}
	if (level >= 20) {
		gameOverMessage = "literally just cheating"
	}
	if (level == 69) {
		gameOverMessage = "nice"
	}
	context.fillText(gameOverMessage, canvasMiddleX, 200)


	context.textAlign = "right"
	var leftOffset = 10
	context.fillText("Difficulty:", canvasMiddleX - leftOffset, (canvas.height / 2) - 100)
	context.fillText("Level:", canvasMiddleX - leftOffset, (canvas.height / 2) - 50)
	context.fillText("Total Hits:", canvasMiddleX - leftOffset, (canvas.height / 2))
	context.fillText("Total Misses:", canvasMiddleX - leftOffset, (canvas.height / 2) + 50)
	context.fillText("Escaped Moles:", canvasMiddleX - leftOffset, (canvas.height / 2) + 100)
	context.fillText("Hit Accuracy:", canvasMiddleX - leftOffset, (canvas.height / 2) + 150)

	context.textAlign = "left"
	var rightOffset = 10
	context.fillText(difficulty, canvasMiddleX + rightOffset, (canvas.height / 2) - 100)
	context.fillText(level, canvasMiddleX + rightOffset, (canvas.height / 2) - 50)
	context.fillText(totalHits, canvasMiddleX + rightOffset, (canvas.height / 2))
	context.fillText(totalMisses, canvasMiddleX + rightOffset, (canvas.height / 2) + 50)
	context.fillText(totalEscapedMoles, canvasMiddleX + rightOffset, (canvas.height / 2) + 100)
	context.fillText(accuracyPercent + " %", canvasMiddleX + rightOffset, (canvas.height / 2) + 150)


	drawTimer(0, canvas.height - 10, canvas.width, 10, gameOverScreenFramesRemaining, gameOverScreenFramesTotal)
}
function levelCompleteUpdate() {
	/*
	Inputs: none
	Outputs: none
	*/
	levelCompleteFramesRemaining -= 1
	if (levelCompleteFramesRemaining <= 0) {
		level += 1
		resetLevel()
		gameState = gameStates.playing
	}
}
function levelCompleteDraw() {
	/*
	Inputs: none
	Outputs: none
	*/
	fillCanvas("black", 1.0)
	context.fillStyle = "green"
	context.font = "80px smw"
	context.textAlign = "center"
	drawTimer(0, canvas.height - 10, canvas.width, 10, levelCompleteFramesRemaining, levelCompleteStartFrames)
	context.fillText("LEVEL " + level + " COMPLETE!", canvasMiddleX, (canvas.height / 2) - 30)
	context.font = "40px smw"
	context.fillText("Next Level starting soon", canvasMiddleX, canvas.height / 2 + 30)
}
function gamingUpdate() {
	/*
	Inputs: none
	Outputs: none
	*/
	// Decrement level timer
	timeRemainingFrames -= 1

	// Check for win
	if (hits >= levelHits) {
		levelCompleteFramesRemaining = levelCompleteStartFrames
		gameState = gameStates.levelComplete
	}

	// Check for loss
	if (timeRemainingFrames <= 0) {
		gameOverScreenFramesRemaining = gameOverScreenFramesTotal
		canRestart = false
		gameState = gameStates.gameOver
	}

	//Determine Middle of the mole
	mole.middleX = mole.x + mole.w / 2
	mole.middleY = mole.y + mole.h / 2
	mole.nextMiddleX = mole.nextX + mole.w / 2
	mole.nextMiddleY = mole.nextY + mole.h / 2

	//Increments the timer for mole movement
	mole.popupFramesRemaining += 1

	// Moves the mole when the timer expires
	if (mole.popupFramesRemaining >= mole.totalPopupFrames) {
		mole.popupFramesRemaining = 0
		escapedMoles += 1
		totalEscapedMoles += 1
		moveMole()
	}
}
function gamingDraw() {
	/*
	Inputs: none
	Outputs: none
	*/
	//Reset the canvas
	fillCanvas("white", 1.0)

	//Draw Background
	context.drawImage(bgImg, 0, 0, canvas.width, canvas.height)

	//Draw line to next position
	context.fillStyle = "black"
	drawLine(mole.middleX, mole.middleY, mole.nextMiddleX, mole.nextMiddleY, 5, "blue")
	drawCircle(mole.nextMiddleX, mole.nextMiddleY, 10, "red", true, false)

	// Draw the mole
	context.drawImage(mole.img, mole.x, mole.y, mole.w, mole.h)

	drawUserInterface()
}
function drawUserInterface() {
	/*
	Inputs: none
	Outputs: none
	*/
	//Set Font
	context.font = "40px smw"

	//Draw UI Box
	context.fillStyle = "#4d4f4e"
	context.fillRect(0, gameAreaHeight, canvas.width, canvas.height)

	//Draw UI Text
	context.fillStyle = "white"
	context.textAlign = "center"

	context.fillText("Level: " + level + " Hits: " + hits + "/" + levelHits + " Misses: " + misses + " Escaped: " + escapedMoles, canvasMiddleX, gameAreaHeight + 50)

	//Draw Timer Bar
	context.fillStyle = "green"
	drawTimer(0, canvas.height - 10, canvas.width, 10, timeRemainingFrames, timerStartFrames, true)

}
function fillCanvas(color, alpha = 1.0) {
	/*
	Inputs: color, alpha
	Outputs: none
	*/
	context.fillStyle = color
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.globalAlpha = alpha
}
function drawDebugInfo() {
	/*
	Inputs: none
	Outputs: none
	*/
	context.font = "40px smw"
	context.fillStyle = "black"
	context.globalAlpha = 0.5

	// Draw Text "Shadow"
	context.fillRect(0, 0, 230, 85)
	context.fillRect(canvasMiddleX - 210, 0, 420, 45)

	// Label indicating debug mode
	context.fillStyle = "white"
	context.globalAlpha = 1.0
	context.textAlign = "center"
	context.fillText("~DEBUG MODE~", canvasMiddleX, 40)
	// Mouse Position
	context.textAlign = "left"
	context.fillText("X: " + mouseX.toFixed(1), 5, 40)
	context.fillText("Y: " + mouseY.toFixed(1), 5, 80)

	// Current and next hitbox
	context.globalAlpha = 0.5
	context.fillStyle = "red"
	context.fillRect(mole.x, mole.y, mole.w, mole.h)
	context.fillStyle = "white"
	context.fillRect(mole.nextX, mole.nextY, mole.w, mole.h)
	context.globalAlpha = 1.0
}
function difficultySelectUpdate() {
	/*
	Inputs: none
	Outputs: none
	*/
	context.font = "40px smw"
	context.textAlign = "center"
	context.fillStyle = "red"
	context.fillText("Select Difficulty", canvasMiddleX, 100)
	buttonSelected = false
	createDifficultyButton(canvasMiddleX, canvasMiddleY - 150, 250, 70, "Easy")
	createDifficultyButton(canvasMiddleX, canvasMiddleY - 50, 250, 70, "Normal")
	createDifficultyButton(canvasMiddleX, canvasMiddleY + 50, 250, 70, "Hard")
	createDifficultyButton(canvasMiddleX, canvasMiddleY + 150, 250, 70, "Expert")
}
function createDifficultyButton(x, y, w, h, text) {
	/*
	Inputs: x, y, w, h, text
	Outputs: none
	*/
	if (checkMouseCollision(x - (w / 2), y - (h / 2), w, h)) {
		// Sets the hits required based on the difficulty
		if (text == "Easy") { levelHits = 3 }
		if (text == "Normal") { levelHits = 5 }
		if (text == "Hard") { levelHits = 10 }
		if (text == "Expert") { levelHits = 20 }
		// Changes difficulty level used on game over screen
		difficulty = text
		// Changes button color when button hovered
		buttonSelected = true
		context.fillStyle = "#7f0f13"
	} else {
		// Changes button color when button is not hovered
		context.fillStyle = "#EE1C24"
	}
	// Draws button backing
	context.fillRect(x - (w / 2), y - (h / 2), w, h)

	// Draws button label
	context.fillStyle = "#FE7E13"
	context.fillText(text, x, y + (h / 4))
}