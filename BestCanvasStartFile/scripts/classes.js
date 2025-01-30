class GameObject {
    constructor(x, y, scale = 1) {
        this.x = x
        this.y = y
        this.h = 0
        this.w = 0
        this.scale = scale
    }
    _ready() {

    }
    _process() {

    }
    _draw(ctx) {

    }
}

class Sprite extends GameObject {
    constructor(imagePath, x = 0, y = 0, scale = 1) {
        super(x, y, scale)
        this.image = new Image()
        this.image.src = imagePath
        this.w = this.image.width
        this.h = this.image.height
    }
    _ready() {

    }
    _process() {
        this.w = this.image.width * this.scale
        this.h = this.image.height * this.scale
    }
    _draw(ctx) {
        if (this.w == 0 || this.h == 0) {
            ctx.drawImage(this.image, this.x, this.y)
        } else {
            ctx.drawImage(this.image, this.x, this.y, this.w, this.h)
        }

    }
}