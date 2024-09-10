var canvas
var context
var intervalNum
var debugMode = false
const fps = 60

var isGameOver = false
var isGameWon = false

var game_area_width = 500
var game_area_height = 450

var ui_area_y = game_area_height
var ui_area_height

var level_length_frames = 30
var TIMER_LOW = 0.1 // time at which timer colour changes to red
var TIMER_WARN = 0.25 // time at which timer colour changes to orange


var level_hits_increase = 5
var level_hits = 10
var speedIncreasePerLevel = 10

var mouseX = 0
var mouseY = 0

var misses = 0
var hits = 0
var level = 1
var lives = 10

var timeRemainingFrames = 2000
var timeTotalFrames = 2000
var timeRemainingPercentage

var winScreenFrames = 60

var mole = {
	x: 100,
	y: 0,
	middleX: 0,
	middleY: 0,
	nextX: 0,
	nextY: 0,
	nextMiddleX: 0,
	nextMiddleY: 0,
	width: 36,
	height: 42,
	colliderX: 0,
	colliderY: 0,
	colliderWidth: 56,
	colliderHeight: 62,
	frames_since_popup: 0,
	popup_frames: 100,
	img: new Image(),
}
mole.colliderX = mole.x - 10
mole.colliderY = mole.y - 10
bgImg = new Image()
bgImg.src = "images/grass.jpg"
mole.img.src = "images/mole.png"
//Event listeners
mole.img.onload = ready
document.onkeydown = thingPressed
document.onclick = thingPressed

function ready() {
	canvas = document.getElementById("canvas")
	// Check if canvas is found
	if (!canvas) {
		error("Canvas element not found")
	}
	context = canvas.getContext("2d")
	canvas.imageSmoothingEnabled = false

	canvas.addEventListener("mousemove", function (event) {
		let rect = canvas.getBoundingClientRect()
		mouseX = event.clientX - rect.left
		mouseY = event.clientY - rect.top
	})

	//Start game update loop with each frame lasting "FRAME_LENGTH_MILLISECONDS"
	intervalNum = setInterval(update, 1000 / fps)
	//clearInterval(intervalNum) // stops the timer
}
function update() {
	game_area_width = canvas.width
	game_area_height = canvas.height - 50
	ui_area_y = game_area_height
	ui_area_height = canvas.height - game_area_height
	canvas.width = canvas.parentNode.clientWidth
	canvas.height = window.innerHeight - 20
	if (isGameOver) {
		gameOver()
	} else if(isGameWon){
		gameWon()
		
	} else{

	}

}


function thingPressed() {
	if (isGameOver) {
		isGameOver = false
		level = 1
		resetLevel()
	} else {
		if (checkMoleCollision(mouseX, mouseY) == true) {
			mole.frames_since_popup = 0
			hits += 1
			moveMole()
		} else {
			misses += 1
		}
	}
}





function checkMoleCollision(x, y) { // Returns true if the x,y coordinates fall inside the mole"s hitbox 
	if (x >= mole.colliderX && x <= mole.colliderX + mole.colliderWidth && y >= mole.colliderY && y <= mole.colliderY + mole.colliderHeight) {
		return true
	}
	return false
}

function randomRange(min, max) {
	return ((Math.random() * (max - min)) + min)
}


function draw() {
	//Reset the canvas
	context.fillStyle = "white"
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.globalAlpha = 1.0

	//Draw Background
	context.drawImage(bgImg, 0, 0, canvas.width, canvas.height)

	//Set Font
	context.font = "15px smw"

	//Draw UI Box
	context.fillStyle = "black"
	context.fillRect(0, ui_area_y, canvas.width, ui_area_height)

	//Draw UI Text
	context.fillStyle = "white"
	context.textAlign = "center"
	var textPosition = {
		x: canvas.width / 2,
		y: ui_area_y + 40
	}
	context.fillText("Level " + level, textPosition.x, textPosition.y)
	context.fillText("Hits " + hits + "/" + level_hits, textPosition.x - 150, textPosition.y)
	context.fillText("Misses " + misses, textPosition.x + 150, textPosition.y)

	//Draw Timer Bar
	context.fillStyle = "green"
	drawTimer(5, ui_area_y, canvas.width - 10, 10)

	//Draw line to next position
	context.fillStyle = "black"
	drawLine(mole.middleX, mole.middleY, mole.nextMiddleX, mole.nextMiddleY, 5, "blue")
	drawCircle(mole.nextMiddleX, mole.nextMiddleY, 10, "red", true, false)

	// Draw the mole
	context.drawImage(mole.img, mole.x, mole.y)

	//Shows the hitboxes and other debug info
	if (debugMode) {
		debugDraw()
	}




}

function drawTimer(x, y, width, height) {
	if (timeRemainingPercentage < TIMER_LOW) {
		context.fillStyle = "red"
	} else if (timeRemainingPercentage < TIMER_WARN) {
		context.fillStyle = "orange"
	} else {
		context.fillStyle = "green"
	}
	context.fillRect(x, y, width * timeRemainingPercentage, height)
}

function debugDraw() {
	context.fillStyle = "white"
	context.textAlign = "left"
	context.fillText("X: " + mouseX, 5, 20)
	context.fillText("Y: " + mouseY, 5, 40)
	context.globalAlpha = 0.5
	context.fillRect(mole.colliderX, mole.colliderY, mole.colliderWidth, mole.colliderHeight)
}

function moveMole() {
	mole.x = mole.nextX
	mole.y = mole.nextY
	mole.nextX = randomRange(0, game_area_width - mole.width)
	mole.nextY = randomRange(0, game_area_height - mole.height)
	mole.colliderX = mole.x - 10
	mole.colliderY = mole.y - 10
}
function drawLine(x1, y1, x2, y2, thickness, color) {
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



function changeLevel(level) {
	isGameWon = true
	resetLevel()
	mole.popup_frames -= speedIncreasePerLevel * level
	
}

function resetLevel() {
	hits = 0
	timeRemainingFrames = timeTotalFrames
	moveMole()
}
function gameOver() {
	context.font = "20px smw"
	context.textAlign = "center"
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.fillStyle = "red"
	context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2)
	context.fillText("Press Any Key to Restart", canvas.width / 2, canvas.height / 2 + 20)
}
function playing() {
	timeRemainingFrames -= 1
	timeRemainingPercentage = timeRemainingFrames / timeTotalFrames
	if (hits >= level_hits) {
		changeLevel(level + 1)
	}
	if (timeRemainingFrames <= 0) {
		isGameOver = true
	}
	mole.middleX = mole.x + 18
	mole.middleY = mole.y + 21
	mole.nextMiddleX = mole.nextX + 18
	mole.nextMiddleY = mole.nextY + 21
	mole.frames_since_popup += 1
	if (mole.frames_since_popup >= mole.popup_frames) {
		mole.frames_since_popup = 0
		misses += 1
		moveMole()
	}
	draw()
}