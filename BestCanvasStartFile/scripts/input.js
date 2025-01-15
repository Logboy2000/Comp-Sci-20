document.addEventListener('keydown', (e) => {
    Input.keys[e.key] = true
})
document.addEventListener('keyup', (e) => {
    Input.keys[e.key] = false
})




class Input {
    static keys = {}
    
    static isKeyPressed(key) {
        return this.keys[key]
    }
    static isKeyJustPressed(key) {

    }
    static isMousePressed(mouseButton) {

    }
    static isMouseJustPressed(mouseButton) {

    }
}