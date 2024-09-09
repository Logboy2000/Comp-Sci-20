var canvas
var context


var FRAME_LENGTH_MILLISECONDS = 17 //approx 60fps

var GAME_AREA_WIDTH = 500
var GAME_AREA_HEIGHT = 450

var UI_AREA_Y = GAME_AREA_HEIGHT
var UI_AREA_HEIGHT

var LEVEL_LENGTH_SECONDS = 30
var TIMERLOW = 1 / 4 // time at which timer colour changes to red
var TIMERWARN = 1 / 2 // time at which timer colour changes to orange


var level_hits_increase = 5
var level_hits = 10
var SPEED_INCREASE = 10

var mouseX = 0
var mouseY = 0

var misses = 0
var hits = 0
var level = 1
var timeRemainingSeconds = 69
var totalTimeSeconds = 20
var timeRemainingPercentage

var mole = {
	x: 100,
	y: 0,
	middleX: 0,
	middleY: 0,
	nextX: 0,
	nextY: 0,
	nextMiddleX: 0,
	nextMiddleY: 0,
	width: 50,
	height: 46,
	frames_since_popup: 0,
	popup_frames: 100,
	img: new Image(),
}
bgImg = new Image()
bgImg.src = "images/grass.jpg"
mole.img.src = "images/mole.png"
mole.img.onload = ready
//Event listenersm vvbv 
document.onkeydown = hit
document.onclick = hit

function ready() {
	canvas = document.getElementById("canvas")
	// Check if canvas is found
	if (!canvas) {
		error("Canvas element not found")
	}
	context = canvas.getContext("2d")
	canvas.imageSmoothingEnabled = false

	canvas.addEventListener("mousemove", function (event) {
		let rect = canvas.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	})




	//Start game update loop
	setInterval(update, FRAME_LENGTH_MILLISECONDS)
}



function hit() {
	if (checkMoleCollision(mouseX, mouseY) == true) {
		mole.frames_since_popup = 0
		hits += 1
		moveMole()
	} else {
		misses += 1
	}
}

function checkMoleCollision(x, y) { // Returns true if the x,y coordinates fall inside the mole"s hitbox 
	if (x >= mole.x && x <= mole.x + mole.width && y >= mole.y && y <= mole.y + mole.height) {
		return true
	}
	return false
}

function randomRange(min, max) {
	return ((Math.random() * (max - min)) + min)
}


function update() {
	timeRemainingPercentage = timeRemainingSeconds / timeRemainingPercentage
	GAME_AREA_WIDTH = canvas.width
	GAME_AREA_HEIGHT = canvas.height - 50
	UI_AREA_Y = GAME_AREA_HEIGHT
	updateCanvasSize()
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

function draw() {
	//Reset the canvas
	context.fillStyle = "white"
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.globalAlpha = 1.0
	//Draw Background
	context.drawImage(bgImg, 0, 0,canvas.width, canvas.height)
	//Set Font
	context.font = "15px smw"
	//Draw UI Box
	context.fillStyle = "black"
	context.fillRect(0, UI_AREA_Y, canvas.width, UI_AREA_HEIGHT)
	//Draw Text
	context.fillStyle = "white"
	context.textAlign = "center"
	var textPosition = {
		x: canvas.width / 2,
		y: UI_AREA_Y +40
	}
	context.fillText("Level " + level, textPosition.x, textPosition.y)
	context.fillText("Hits " + hits + "/" + level_hits, textPosition.x - 150, textPosition.y)
	context.fillText("Misses " + misses, textPosition.x + 150, textPosition.y)
	context.fillText(mouseX + ", " + mouseY, textPosition.x - 300, textPosition.y)
	//Draw Timer Bar
	context.fillStyle = "green"
	drawTimer(5, UI_AREA_Y, canvas.width - 10, 10, timeRemainingSeconds, totalTimeSeconds)




	//Draw line to next position
	context.fillStyle = "black"
	drawLine(mole.middleX, mole.middleY, mole.nextMiddleX, mole.nextMiddleY, 5, "blue")
	drawCircle(mole.nextMiddleX, mole.nextMiddleY, 10, "red", true, false)
	// Draw the mole
	context.drawImage(mole.img, mole.x, mole.y)
	context.globalAlpha = 0.5
	context.fillRect(mole.x, mole.y, mole.width, mole.height)



}

function drawTimer(x, y, width, height, timeRemainingSeconds, totalTime) {
	if (timeRemainingPercentage < 0.1) {
		context.fillStyle = "red"
	} else if (timeRemainingSeconds < 0.4) {
		context.fillStyle = "orange"
	} else {
		context.fillStyle = "green"
	}
	context.fillRect(x, y, width, height)
}


function fancyLog(name, value) {
	console.log(name + ": " + value)
}
function moveMole() {
	mole.x = mole.nextX
	mole.y = mole.nextY
	mole.nextX = randomRange(0, GAME_AREA_WIDTH - mole.width)
	mole.nextY = randomRange(0, GAME_AREA_HEIGHT - mole.height)
}
function error(description) {
	alert("ERROR. CHECK LOGS PLEASE (" + description + ")")
	console.error(description)
	return
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
function updateCanvasSize() {
	UI_AREA_HEIGHT = canvas.height - GAME_AREA_HEIGHT
	canvas.width = canvas.parentNode.clientWidth
	canvas.height = window.innerHeight - 20//canvas.parentNode.clientHeight
}
function changeLevel(level){
	
}