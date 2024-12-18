const canvas = document.getElementById('gameCanvas')


var fps = 0
var lastUpdateTime = 0
var deltaTime = 0 // the magic number we love
var currentScene = null
var debug = true

var camera = {
    x: 0,
    y: 0,
    moveSpeed: 500,
    zoomAmount: 1.1,
    zoomSpeed: 0.1,
    zoom: 1,
    targetZoom: 1
}

function loaded() { // when body tag is loaded
    currentScene = new Scene()
    canvas.width = 500
    canvas.height = 800

    canvas.addEventListener('wheel', handleWheel)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    loop() // start the game loop
}

function loop() {
    const ctx = canvas.getContext('2d')
    // Make canvas fill the screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Add resize event listener to keep canvas full screen
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    })

    clearCanvas(ctx, '#FFFFFF')

    const currentTime = performance.now()
    deltaTime = (currentTime - lastUpdateTime) / 1000
    fps = (1000 / (currentTime - lastUpdateTime)).toFixed(2)
    lastUpdateTime = currentTime

    updateCamera()

    ctx.save()
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2)
    ctx.scale(camera.zoom, camera.zoom)

    currentScene.addObject(
        new Particle2D(
            'images/twirl_02.png',
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

    currentScene.update()
    currentScene.draw(ctx)

    ctx.restore()

    if (debug) {
        debugDraw(ctx)
    }
    requestAnimationFrame(loop)
}

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    a: false,
    s: false,
    d: false
}
function handleKeyDown(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true
    }
}

function handleKeyUp(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false
    }
}

function handleWheel(e) {
    const zoomSpeed = 1.1
    if (e.deltaY < 0) {
        camera.targetZoom *= zoomSpeed
    }
    if (e.deltaY > 0) {
        camera.targetZoom /= zoomSpeed
    }
}

function updateCamera() {
    if (keys.ArrowUp || keys.w) camera.y -= camera.moveSpeed * deltaTime
    if (keys.ArrowLeft || keys.a) camera.x -= camera.moveSpeed * deltaTime
    if (keys.ArrowDown || keys.s) camera.y += camera.moveSpeed * deltaTime
    if (keys.ArrowRight || keys.d) camera.x += camera.moveSpeed * deltaTime
    camera.zoom = lerp(camera.zoom, camera.targetZoom, camera.zoomSpeed)
}
function debugDraw(ctx) {
    drawText(ctx, 'Object Count: ' + currentScene.objects.length, 0, 10)
    drawText(ctx, 'FPS: ' + fps, 0, 20)
    drawText(ctx, 'Delta Time: ' + deltaTime, 0, 30)
    drawText(ctx, 'Resolution: ' + canvas.width + 'x' + canvas.height, 0, 40)
    drawText(ctx, 'Camera: ' + Math.round(camera.x) + ',' + Math.round(camera.y) + ',' + camera.targetZoom.toFixed(2), 0, 50)
}

class Scene {
    constructor() {
        this.objects = []
    }
    update() {
        this.objects.forEach(object => {
            object.update()
            if (object.destroyed) {
                this.objects.splice(this.objects.indexOf(object), 1)
            }
        })
    }
    draw(ctx) {
        this.objects.forEach(object => {
            object.draw(ctx)
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
    update() { }
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
    update() { }
    draw(ctx) {
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
    update() {
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

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2)
        ctx.rotate(this.r)
        ctx.drawImage(this.image, -this.w / 2, -this.h / 2, this.w, this.h)
        ctx.restore()
    }
}


function drawText(ctx, text, x, y, alignment = 'left', fontSize = 10, fontName = 'Arial') {
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