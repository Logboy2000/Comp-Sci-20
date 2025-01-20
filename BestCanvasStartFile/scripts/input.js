document.addEventListener('keydown', (e) => {
    Input.pressedKeys[e.key] = true
})
document.addEventListener('keyup', (e) => {
    Input.pressedKeys[e.key] = false
})
document.addEventListener('mousedown', (e) => {
    Input.pressedMouse[e.button] = true;
})
document.addEventListener('mouseup', (e) => {
    Input.pressedMouse[e.button] = false;
})
document.addEventListener('mousemove', (e) => {
    Input.mouse.x = e.clientX;
    Input.mouse.y = e.clientY;
})
document.addEventListener('wheel', (e) => {
    Input.scrollDelta = e.deltaY;
})

class Input {

    static mouse = {
        x: 0,
        y: 0
    }
    static pressedKeys = {}
    static justPressedKeys = {}

    static pressedMouse = {}
    static justPressedMouse = {}
    static scrollDelta = 0

    static _process() { // Runs every frame
        for (const key in this.pressedKeys) {
            this.justPressedKeys[key] = false
            if (this.pressedKeys[key]) {
                if (!this.justPressedKeys[key]) {
                    this.justPressedKeys[key] = true
                }
            }
        }
        // Reset scroll delta after processing
        this.scrollDelta = 0;
    }
    static isKeyPressed(key) {
        if (this.pressedKeys[key] == true) {
            console.log(key)
        }
        return this.pressedKeys[key]
    }
    static isKeyJustPressed(key) {
        return this.justPressedKeys[key]
    }
    static isMousePressed(mouseButton) {
        return this.mouse[mouseButton]
    }
    static isMouseJustPressed(mouseButton) {
        return this.justPressedMouse[mouseButton]
    }
    static getMousePosition() {
        return {
            x: this.mouse.x,
            y: this.mouse.y
        }
    }
    static getScrollDelta() {
        return this.scrollDelta;
    }
}