class GameObject {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    ready() {

    }
    process() {

    }
    draw(ctx) {

    }
}
class Player extends GameObject {
    constructor(x, y, w, h, color, moveSpeed) {
        super(x, y, w, h)
        this.color = color
        this.moveSpeed = moveSpeed
    }
    process() {
        var inputDirX = 0
        var inputDirY = 0
        if (Input.isKeyPressed('a') || Input.isKeyPressed('ArrowLeft')) {
            inputDirX--
        }
        if (Input.isKeyPressed('d') || Input.isKeyPressed('ArrowRight')) {
            inputDirX++
        }
        if (Input.isKeyPressed('s') || Input.isKeyPressed('ArrowDown')) {
            inputDirY++
        }
        if (Input.isKeyPressed('w') || Input.isKeyPressed('ArrowUp')) {
            inputDirY--
        }

        this.x += inputDirX * this.moveSpeed * deltaTime
        this.y += inputDirY * this.moveSpeed * deltaTime

    }
    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}