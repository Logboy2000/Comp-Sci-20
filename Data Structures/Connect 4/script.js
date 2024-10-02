var canvas
var ctx

const FPS = 60

var box = {
    x: 50,
    y: 0,
}

function go() {
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    setInterval(update, 1000 / FPS)
}

function update() {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#000000'

    box.y += 1
    ctx.fillStyle = 'FF0000'
    drawCircle(box.x, box.y, 50)
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