class Building {
    constructor(name, cost, cookiesPerSecond, image) {
        this.name = name
        this.cost = cost
        this.cookiesPerSecond = cookiesPerSecond
        this.owned = 0
        this.unlocked = false
        this.upgradeLevel = 1
        this.image = image
    }
}

class CookieIncreaseDisplay {
    constructor(value, x, y) {
        this.element = document.createElement('p')
        this.element.innerText = '+' + formatBigNumber(value)
        this.element.className = 'cookieIncreaseDisplay'
        this.element.style.left = x + 'px'
        this.element.style.top = y + 'px'
        this.element.style.opacity = 1
    }

    appendTo(container) {
        container.appendChild(this.element)
        var opacity = 1
        var topPosition = parseFloat(this.element.style.top)
        const fadeInterval = setInterval(() => {
            opacity -= 0.01
            topPosition -= 1
            this.element.style.opacity = opacity
            this.element.style.top = topPosition + 'px'
            if (opacity <= 0) {
                clearInterval(fadeInterval)
                this.element.remove()
            }
        }, 1000 / FPS)
    }
}

class CookieParticle {
    constructor(inputX, inputY, inputR) {
        this.element = document.createElement('img')

        this.x = inputX
        this.y = inputY
        this.r = inputR
        this.element.style.left = this.x + 'px'
        this.element.style.top = this.y + 'px'
        this.element.style.transform = 'rotate(' + this.r + 'deg)'

        
        this.element.src = 'images/particles/cookie.png'
        this.element.className = 'particles'
        this.element.style.opacity = 1

        
        

        this.xSpeed = randomRange(-3, 3)
        this.ySpeed = randomRange(-5, -10)
        
        this.gravity = 0.5
        

        
        
        
        document.getElementById('particleContainer').appendChild(this.element)

        const animInterval = setInterval(() => {
            this.element.style.opacity -= 0.02
            this.r+=3

            this.ySpeed += this.gravity
            this.x += this.xSpeed 
            this.y += this.ySpeed


            this.element.style.left = this.x + 'px'
            this.element.style.top = this.y + 'px'
            this.element.style.transform = 'rotate(' + this.r + 'deg)'
            if (this.element.style.opacity <= 0) {
                clearInterval(animInterval)
                this.element.remove()
            }
        }, 1000 / FPS)
    }
}

class Notification {
    constructor(title, description) {
        this.element = document.createElement('div')

        this.title = document.createElement('label')
        this.title.innerText = title
        this.element.appendChild(this.title)

        this.description = document.createElement('p')
        this.description.innerText = description
        this.element.appendChild(this.description)

        this.element.className = 'notification'
        this.element.style.opacity = 1
        document.getElementById('notificationContainer').appendChild(this.element)

        setTimeout(() => {
            const fadeInterval = setInterval(() => {
                this.element.style.opacity -= 0.01
                if (this.element.style.opacity <= 0) {
                    clearInterval(fadeInterval)
                    this.element.remove()
                }
            }, 1000 / FPS)
        }, 1000)


    }
}
