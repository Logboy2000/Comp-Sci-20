const canvas = document.getElementById('gameCanvas')


var fps = 0
const vsync = false

var lastUpdateTime = 0
var deltaTime = 0 // the magic number we love
var game = null
var debug = true



function loaded() { // when body tag is loaded
    game = new Game(new Scene())
    canvas.width = 500
    canvas.height = 800

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    })

    game.currentScene.addObject(new RectangleCollisionShape(0, 0, canvas.width, canvas.height))
    game.currentScene.addObject(new CircleCollisionShape(-100, 100, 500))

    lastUpdateTime = performance.now()
    if (vsync) {
        requestAnimationFrame(loop)
    } else {
        setInterval(() => requestAnimationFrame(loop), 0)
    }



}

function loop() {
    const currentTime = performance.now()
    deltaTime = (currentTime - lastUpdateTime) / 1000
    fps = (1000 / (currentTime - lastUpdateTime)).toFixed(2)
    lastUpdateTime = currentTime

    const ctx = canvas.getContext('2d')
    // Make canvas fill the screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    clearCanvas(ctx, '#FFFFFF')

    updateCamera()

    ctx.save()
    ctx.translate(-game.camera.x + canvas.width / 2, -game.camera.y + canvas.height / 2)
    ctx.scale(game.camera.zoom, game.camera.zoom)
    for (var i = 0; i < 20; i++) {
        game.currentScene.addObject(
            new Particle2D(
                'images/fire_01.png',
                0,
                0,
                randomRange(50, 100),
                randomRange(50, 100),
                randomRange(-360, 360),
                randomRange(-360, 360),
                randomRange(-360, 360),
                0,
                0,
                randomRange(-10, 10),
                randomRange(1000, 2000),
            )
        )
    }



    game.update()
    game.draw(ctx)

    ctx.restore()


    if (game.input.isKeyPressed('`')) {
        debug = !debug
    }

    if (debug) {
        debugDraw(ctx)
    }
    if (vsync) {
        requestAnimationFrame(loop)
    }

}

function updateCamera() {

    if (game.input.isKeyPressed('=')) {
        game.camera.targetZoom *= game.camera.zoomAmount
    } else if (game.input.isKeyPressed('-')) {
        game.camera.targetZoom /= game.camera.zoomAmount
    }

    if (game.input.isKeyPressed('ArrowUp') || game.input.isKeyPressed('w')) game.camera.y -= game.camera.moveSpeed * deltaTime
    if (game.input.isKeyPressed('ArrowLeft') || game.input.isKeyPressed('a')) game.camera.x -= game.camera.moveSpeed * deltaTime
    if (game.input.isKeyPressed('ArrowDown') || game.input.isKeyPressed('s')) game.camera.y += game.camera.moveSpeed * deltaTime
    if (game.input.isKeyPressed('ArrowRight') || game.input.isKeyPressed('d')) game.camera.x += game.camera.moveSpeed * deltaTime

    if (game.camera.smoothZoom == true) {
        game.camera.zoom = lerp(game.camera.zoom, game.camera.targetZoom, game.camera.zoomSpeed)
    } else {
        game.camera.zoom = game.camera.targetZoom
    }

}
var fpsHistory = []
function debugDraw(ctx) {
    drawText(ctx, 'Object Count: ' + game.currentScene.objects.length, 0, 10)
    drawText(ctx, 'FPS: ' + fps + '  V-Sync: ' + vsync, 0, 20)
    drawText(ctx, 'Delta Time: ' + deltaTime, 0, 30)
    drawText(ctx, 'Resolution: ' + canvas.width + 'x' + canvas.height, 0, 40)
    drawText(ctx, 'Camera: ' + Math.round(game.camera.x) + ',' + Math.round(game.camera.y) + ',' + game.camera.targetZoom.toFixed(2), 0, 50)
    drawText(ctx, 'Mouse: ' + game.input.getMousePos().x + ',' + game.input.getMousePos().y, 0, 60)
    if (vsync) {

    }
    drawGraph(
        ctx,
        fps,
        0,
        70,
        150,
        100,
        'FPS',
        'Frames',
        'FPS',
        30,
        60,
        3,
        10,
        60
    )
    drawGraph(
        ctx,
        deltaTime,
        0,
        200,
        150,
        100,
        'Frametimes',
        'Frames',
        'DT',
        0.02,
        0.01,
        3,
        0.05,
        0,
        2,
        false
    )
}

function drawGraph(ctx, value, x, y, w, h, title = 'Title', xAxisName = 'x-axis', yAxisName = 'y-axis', yellowThreshold = 50, greenThreshold = 100, labelCount = 3, stepSize = 50, minYScale = 100, decimalPlaces = 0, higherIsBetter = true) {
    // Draw graph 
    // Jank as hell but it works

    // Create a static map to store value histories for different graphs
    if (typeof drawGraph.valueHistories === 'undefined') {
        drawGraph.valueHistories = new Map()
        drawGraph.currentMaxValues = new Map()
    }

    // Use title as unique identifier for graphss
    const graphKey = title

    if (!drawGraph.valueHistories.has(graphKey)) {
        drawGraph.valueHistories.set(graphKey, [])
        drawGraph.currentMaxValues.set(graphKey, undefined)
    }

    const graphWidth = w
    const graphHeight = h

    const graphX = x + 25
    const graphY = y + 15

    const valueHistory = drawGraph.valueHistories.get(graphKey)
    valueHistory.push(value)
    if (valueHistory.length > graphWidth) {
        valueHistory.shift()
    }

    const maxValue = Math.max(...valueHistory, minYScale)
    const targetMaxValue = Math.ceil(maxValue / stepSize) * stepSize

    // Store the current scale in the static map
    if (typeof drawGraph.currentMaxValues.get(graphKey) === 'undefined') {
        drawGraph.currentMaxValues.set(graphKey, targetMaxValue)
    }

    // Smoothly transition to new scale
    let currentMaxValue = drawGraph.currentMaxValues.get(graphKey)
    currentMaxValue = lerp(currentMaxValue, targetMaxValue, 0.1)
    drawGraph.currentMaxValues.set(graphKey, currentMaxValue)
    const roundedMaxValue = currentMaxValue

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(graphX, graphY, graphWidth, graphHeight)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 5
    ctx.strokeRect(graphX, graphY, graphWidth, graphHeight)
    ctx.lineWidth = 1.5



    // Draw value line
    ctx.beginPath()
    for (let i = 0; i < valueHistory.length; i++) {
        const currentValue = valueHistory[i]

        if (higherIsBetter) {
            if (currentValue >= greenThreshold) {
                ctx.strokeStyle = 'rgb(0, 255, 38)' // Green for high value
            } else if (currentValue >= yellowThreshold) {
                ctx.strokeStyle = 'rgb(255, 255, 0)' // Yellow for medium value
            } else {
                ctx.strokeStyle = 'rgb(255, 0, 0)' // Red for low value
            }
        } else {
            if (currentValue <= greenThreshold) {
                ctx.strokeStyle = 'rgb(0, 255, 38)' // Green for high value
            } else if (currentValue <= yellowThreshold) {
                ctx.strokeStyle = 'rgb(255, 255, 0)' // Yellow for medium value
            } else {
                ctx.strokeStyle = 'rgb(255, 0, 0)' // Red for low value
            }
        }

        const x = graphX + (i * (graphWidth / valueHistory.length))
        const normalizedValue = Math.min(Math.max(currentValue, 0), roundedMaxValue)
        const y = Math.min(Math.max(
            graphY + graphHeight - (normalizedValue / roundedMaxValue * graphHeight),
            graphY
        ), graphY + graphHeight)

        if (i === 0) {
            ctx.moveTo(x, y)
        } else {
            ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
    }
    ctx.stroke()
    ctx.closePath()

    // Draw threshold regions
    const greenColor = 'rgba(0, 255, 38, 0.3)'
    const yellowColor = 'rgba(255, 255, 0, 0.3)'
    const redColor = 'rgba(255, 0, 0, 0.3)'

    if (higherIsBetter) {
        // Green region
        ctx.fillStyle = greenColor
        const greenHeight = (roundedMaxValue - greenThreshold) / roundedMaxValue * graphHeight
        ctx.fillRect(graphX, graphY, graphWidth, greenHeight)

        // Yellow region
        ctx.fillStyle = yellowColor
        const yellowHeight = (greenThreshold - yellowThreshold) / roundedMaxValue * graphHeight
        ctx.fillRect(graphX, graphY + greenHeight, graphWidth, yellowHeight)

        // Red region
        ctx.fillStyle = redColor
        const redHeight = yellowThreshold / roundedMaxValue * graphHeight
        ctx.fillRect(graphX, graphY + greenHeight + yellowHeight, graphWidth, redHeight)
    } else {
        // Green region
        ctx.fillStyle = greenColor
        const greenHeight = greenThreshold / roundedMaxValue * graphHeight
        ctx.fillRect(graphX, graphY + (graphHeight - greenHeight), graphWidth, greenHeight)

        // Yellow region
        ctx.fillStyle = yellowColor
        const yellowHeight = (yellowThreshold - greenThreshold) / roundedMaxValue * graphHeight
        ctx.fillRect(graphX, graphY + (graphHeight - greenHeight - yellowHeight), graphWidth, yellowHeight)

        // Red region
        ctx.fillStyle = redColor
        const redHeight = (roundedMaxValue - yellowThreshold) / roundedMaxValue * graphHeight
        ctx.fillRect(graphX, graphY, graphWidth, redHeight)
    }

    ctx.fillStyle = 'black'

    // Draw axis labels with smooth scale
    for (let i = 0; i <= labelCount; i++) {
        const value = (roundedMaxValue * (labelCount - i) / labelCount).toFixed(decimalPlaces)
        const yPos = graphY + (graphHeight * i / labelCount)
        drawText(ctx, value.toString(), graphX - 5, yPos, 'right', 10)
    }
    drawText(ctx, xAxisName, graphX + graphWidth / 2, graphY + graphHeight + 15, 'center')
    drawText(ctx, title, graphX + graphWidth / 2, graphY - 5, 'center')
}
class Game {
    constructor(currentScene) {
        this.currentScene = currentScene
        this.input = new Input()
        this.currentFrame = 0
        this.camera = {
            x: 0,
            y: 0,
            moveSpeed: 500,
            zoomAmount: 1.01,
            zoomSpeed: 0.1,
            zoom: 1,
            targetZoom: 1,
            smoothZoom: true
        }
    }
    update() {
        this.currentFrame++
        this.currentScene.update()
    }
    draw(ctx) {
        this.currentScene.draw(ctx)
    }
}

class Scene {
    constructor() {
        this.objects = []
    }
    update() {
        this.objects.forEach(object => {
            object._update()
            if (object.destroyed) {
                this.objects.splice(this.objects.indexOf(object), 1)
            }
        })
    }
    draw(ctx) {
        this.objects.forEach(object => {
            object._draw(ctx)
        })
    }
    addObject(object) {
        this.objects.push(object)
        return object
    }
}

class Object2D {
    constructor(x = 0, y = 0, w = 0, h = 0, r = 0) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.r = r
        this.destroyed = false
    }
    _update() { }
    _draw(ctx) { }
    destroy() {
        this.destroyed = true
    }
}
class Sprite2D extends Object2D {
    constructor(x = 0, y = 0, w = 0, h = 0, r = 0, imagePath = '') {
        super(x, y, w, h, r)
        this.image = new Image()
        this.image.src = imagePath
    }
    _update() { }
    _draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h)
    }
}

class Particle2D extends Sprite2D {
    constructor(
        imagePath = '',
        x = 0,
        y = 0,
        w = 0,
        h = 0,
        r = 0,
        xv = 0,
        yv = 0,
        xg = 0,
        yg = 0,
        rv = 0,
        lifetimeMilliseconds = 1000
    ) {
        super(x, y, w, h, r, imagePath)
        this.xv = xv
        this.yv = yv
        this.rv = rv
        this.xg = xg
        this.yg = yg
        this.lifetimeMilliseconds = lifetimeMilliseconds
    }
    _update() {
        this.lifetimeMilliseconds -= deltaTime * 1000
        this.xv += this.xg * deltaTime
        this.yv += this.yg * deltaTime
        this.r += this.rv * deltaTime
        this.x += this.xv * deltaTime
        this.y += this.yv * deltaTime
        if (this.lifetimeMilliseconds <= 0) {
            this.destroy()
        }
    }

    _draw(ctx) {
        ctx.save()
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2)
        ctx.rotate(this.r)
        ctx.drawImage(this.image, -this.w / 2, -this.h / 2, this.w, this.h)
        ctx.restore()
    }
}


function drawText(ctx, text, x, y, alignment = 'left', fontSize = 10, fontName = 'Comic Sans MS') {
    ctx.font = fontSize + "px " + fontName
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min
}

function lerp(startValue, targetValue, interpolationFactor) {
    return startValue + (targetValue - startValue) * interpolationFactor
}

function clearCanvas(ctx, clearColor = '#FFFFFF') {
    var prevFillStyle = ctx.fillStyle
    ctx.fillStyle = clearColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = prevFillStyle
}


class Input {
    constructor() {
        this.keys = {}
        this.actions = {}
        this.mousePos = { x: 0, y: 0 }
        this.mouseButtons = {}
        this.scrollDirection = 0

        // Add keyboard event listeners
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.key]) {
                this.keys[e.key] = { pressed: true, justPressed: true }
            } else {
                this.keys[e.key].pressed = true
                this.keys[e.key].justPressed = true
            }
        })

        window.addEventListener('keyup', (e) => {
            if (this.keys[e.key]) {
                this.keys[e.key].pressed = false
                this.keys[e.key].justPressed = false
            }
        })

        // Add mouse event listeners
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect()
            this.mousePos.x = e.clientX - rect.left
            this.mousePos.y = e.clientY - rect.top
        })

        canvas.addEventListener('mousedown', (e) => {
            if (!this.mouseButtons[e.button]) {
                this.mouseButtons[e.button] = { pressed: true, justPressed: true }
            } else {
                this.mouseButtons[e.button].pressed = true
                this.mouseButtons[e.button].justPressed = true
            }
        })

        canvas.addEventListener('mouseup', (e) => {
            if (this.mouseButtons[e.button]) {
                this.mouseButtons[e.button].pressed = false
                this.mouseButtons[e.button].justPressed = false
            }
        })
        canvas.addEventListener('wheel', (e) => {
            this.scrollDirection = Math.sign(e.deltaY)
        })

    }

    addAction(name, inputs) {
        this.actions[name] = inputs
        this.actionStrength[name] = 0
    }

    isActionPressed(action) {
        if (!this.actions[action]) return false
        for (let input of this.actions[action]) {
            if (this.keys[input] || this.mouseButtons[input]) return true
        }
        return false
    }

    isActionJustPressed(action) {
        if (!this.actions[action]) return false;
        for (let input of this.actions[action]) {
            if (this.keys[input]?.justPressed || this.mouseButtons[input]?.justPressed) return true
        }
        return false
    }


    isKeyPressed(key) {
        return this.keys[key]?.pressed || false
    }

    isMouseButtonPressed(button) {
        return this.mouseButtons[button]?.pressed || false
    }


    getScrollDirection() {
        return this.scrollDirection
    }

    getMousePos() {
        return this.mousePos
    }
}

class CollisionObject2D extends Object2D {
    constructor(collisionShape, x, y) {
        super(x, y, 0, 0, 0)
        this.collisionShape = collisionShape

    }
    _update() {
        this.collisionShape.x = this.x
        this.collisionShape.y = this.y
        this.collisionShape._update()
    }
    _draw(ctx) {
        this.collisionShape._draw(ctx)
    }
}

class CollisionShape extends Object2D {
    constructor(x, y) {
        super(x, y, 0, 0, 0)
        this.disabled = false
        this.debugFillColor = 'rgba(0, 140, 255, 0.5)'
        this.debugStrokeColor = 'rgba(0, 65, 118, 0.5)'
    }

    _update() {

    }
    _draw(ctx) {
        this._drawShape(ctx)
    }
    _drawShape(ctx) { }
}

class CircleCollisionShape extends CollisionShape {
    constructor(x, y, radius) {
        super(x, y)
        this.radius = radius
    }

    _drawShape(ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.debugFillColor
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.strokeStyle = this.debugStrokeColor
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.closePath()
    }
}

class RectangleCollisionShape extends CollisionShape {
    constructor(x, y, width, height) {
        super(x, y)
        this.width = width
        this.height = height
    }

    _drawShape(ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.debugFillColor
        ctx.rect(this.x, this.y, this.x + this.width, this.y + this.height)
        ctx.fill()
        ctx.strokeStyle = this.debugStrokeColor
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.closePath()
    }
}
