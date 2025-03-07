// JS Canvas Game Start File

var vsync = false
var fps = 0
var deltaTime = 0
var lastUpdateTime

var canvasMiddle = {
    x: 0,
    y: 0
}

var camera = {
    x: 0,
    y: 0,
    zoom: 1
}

var gameObjects = []


function engineReady() {
    var canvas = getElement('canvas')
    var ctx = canvas.getContext('2d')

    lastUpdateTime = performance.now()
    _ready()



    setInterval(
        () =>
            requestAnimationFrame(
                () =>
                    engineProcess(canvas, ctx)
            ),
        1
    )
}

function engineProcess(canvas, ctx) {
    // FPS Calculations
    const currentTime = performance.now()
    deltaTime = (currentTime - lastUpdateTime) / 1000
    var timeDifference = currentTime - lastUpdateTime;

    // Prevent division by zero
    if (timeDifference <= 0) {
        timeDifference = 1
    }

    // Calculate FPS to 2 decimal places
    fps = (1000 / timeDifference).toFixed(2)
    lastUpdateTime = currentTime

    // Updates canvas size and values
    canvas.width = canvas.parentNode.clientWidth
    canvas.height = canvas.parentNode.clientHeight
    canvasMiddle.x = canvas.width / 2
    canvasMiddle.y = canvas.height / 2

    Input._process()



    ////DRAWiNG////
    //clear screen
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Apply Camera Zoom
    ctx.save()
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2)
    ctx.scale(camera.zoom, camera.zoom)

    // draw stuff affected by camera
    _process()
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i]._process()
        gameObjects[i]._draw(ctx)
    }

    // Finish Camera Zoom
    ctx.restore()

    // draw stuff not affected by camera
    drawUI(ctx)
}

function _ready() {
    fpsGraph = new Graph({
        yellowThreshold: 30,
        greenThreshold: 600,
        labelCount: 5,
        stepSize: 0.1,
        minYScale: 1,
        decimalPlaces: 2,
        higherIsBetter: true
    })
    gameObjects.push(new Sprite('images/layer1.png', 0, 0, 5))
}

function _process() {
    // Input
    if (Input.isKeyPressed("w")) {
        camera.y -= 100 * deltaTime
    }
    if (Input.isKeyPressed("a")) {
        camera.x -= 100 * deltaTime
    }
    if (Input.isKeyPressed("s")) {
        camera.y += 100 * deltaTime
    }
    if (Input.isKeyPressed("d")) {
        camera.x += 100 * deltaTime
    }
    if (Input.isKeyJustPressed("r")) {
        camera.zoom = 1
    }
}

function drawUI(ctx) {
    ctx.fillStyle = "#000000"
    fpsGraph.drawGraph(ctx, fps, 30, 30, 200, 100, "fps", "time", "")
}

function getElement(id = '') {
    return document.getElementById(id)
}