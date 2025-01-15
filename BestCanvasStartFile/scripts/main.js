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

var player
var fpsGraph

function ready() {
    var canvas = getElement('canvas')
    var ctx = canvas.getContext('2d')

    lastUpdateTime = performance.now()

    fpsGraph = new Graph({
        yellowThreshold: 30,
        greenThreshold: 600,
        labelCount: 5,
        stepSize: 0.1,
        minYScale: 1,
        decimalPlaces: 2,
        higherIsBetter: true
    });


    setInterval(
        () =>
            requestAnimationFrame(
                () =>
                    process(canvas, ctx)
            ),
        0
    )
}

function process(canvas, ctx) {
    const currentTime = performance.now()
    deltaTime = (currentTime - lastUpdateTime) / 1000
    var timeDifference = currentTime - lastUpdateTime;

    // Prevent division by zero or extremely small time differences
    if (timeDifference <= 0) {
        timeDifference = 1; // Assign a small positive value to avoid Infinity
    }

    fps = (1000 / timeDifference).toFixed(2)
    lastUpdateTime = currentTime

    // Updates canvas size and values
    canvas.width = canvas.parentNode.clientWidth
    canvas.height = canvas.parentNode.clientHeight
    canvasMiddle.x = canvas.width / 2
    canvasMiddle.y = canvas.height / 2




    ////DRAWiNG////
    // Apply Camera Zoom
    ctx.save()
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2)
    ctx.scale(camera.zoom, camera.zoom)

    //clear screen and draw
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    draw(ctx)

    // Finish Camera Zoom
    ctx.restore()


    drawUI(ctx)
}

function drawUI(ctx) {
    ctx.fillStyle = "#000000"
    fpsGraph.drawGraph(ctx, fps, 30, 30, 200, 100, "fps", "time", "")
    console.log(fps)
}

function draw(ctx) {
    ctx.fillStyle = '#000000'

}


function getElement(id = '') {
    return document.getElementById(id)
}