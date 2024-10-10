const FPS = 60
var cookies = 0
var cookiesPerSecond = 0
var buildings = [
    {
        name: 'Cursor',
        cost: 15,
        cookiesPerSecond: 0.2,
        owned: 0
    },
    {
        name: 'Grandma',
        cost: 100,
        cookiesPerSecond: 1,
        owned: 0
    },
    {
        name: 'Farm',
        cost: 1100,
        cookiesPerSecond: 8,
        owned: 0
    },
    {
        name: 'Mine',
        cost: 12000,
        cookiesPerSecond: 47,
        owned: 0
    },
    {
        name: 'Factory',
        cost: 130000,
        cookiesPerSecond: 260,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },
    {
        name: 'Bank',
        cost: 1400000,
        cookiesPerSecond: 1400,
        owned: 0
    },

]

var upgrades = {
    cookiesPerClick: {
        cost: 100,
        value: 1
    },
}

var settings = {
    autoClicker: false,
    particles: true
}


var mouse = {
    x: 0,
    y: 0
}

function go() {
    document.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX - 10
        mouse.y = e.clientY - 20
    })
    document.addEventListener('keydown', function(e){
        switch(e.key){
            case ' ':
                cookieClicked()
            break
        }
        
    })

    setInterval(update, 1000 / FPS)
    createShopButtons()
}

function update() {
    upgrades.cookiesPerClick.value = Number(document.getElementById('cookiesPerClick').value)

    if (settings.autoClicker == true) {
        cookieClicked()
    }
    cookiesPerSecond = 0
    for (var i = 0; i < buildings.length; i++) {
        for (var j = 0; j < buildings[i].owned; j++) {
            cookies += (buildings[i].cookiesPerSecond) / FPS
            // Calculate cookies per second for each building
            cookiesPerSecond += (buildings[i].cookiesPerSecond)
        }
    }











    updateShopButtons()
    document.getElementById('cookiesPerSecond').innerText = 'Per second: ' + cookiesPerSecond.toFixed(1)
    if (cookies == 1) {
        document.getElementById('cookieCount').innerText = Math.floor(cookies) + ' cookie'
    } else {
        document.getElementById('cookieCount').innerText = Math.floor(cookies) + ' cookies'
    }
    document.getElementById('tabTitle').innerText = document.getElementById('cookieCount').innerText+' - Cockie Clorker'
}

function updateShopButtons() {
    for (var i = 0; i < buildings.length; i++) {
        var button = document.getElementById('product' + i)
        var building = buildings[i]

        button.textContent = `${building.name} - ${building.cost} cookies`

        if (cookies >= building.cost) {
            button.disabled = false
        } else {
            button.disabled = true
        }
    }
}

function cookieClicked() {
    cookies += upgrades.cookiesPerClick.value
    if (settings.particles == true) {
        const cookieIncreaseDisplay = new CookieIncreaseDisplay(upgrades.cookiesPerClick.value, mouse.x, mouse.y)
        cookieIncreaseDisplay.appendTo(document.getElementById('cookieContainer'))
    }
}
function createShopButtons() {
    for (var i = 0; i < buildings.length; i++) {
        const building = buildings[i];
        const buttonDiv = document.createElement('button')
        buttonDiv.id = 'product' + i
        buttonDiv.className = 'shopButton'
        buttonDiv.disabled = true
        buttonDiv.style.backgroundImage = "url('https://orteil.dashnet.org/experiments/cookie/grandmaicon.png')"
        buttonDiv.onclick = function () {
            buyBuilding(building)
        }
        document.getElementById('shop').appendChild(buttonDiv)
    }
}

function buyBuilding(building) {
    if (cookies >= building.cost) {
        cookies -= building.cost
        building.owned += 1
        building.cost = Math.ceil(building.cost * Math.pow(1.05, building.owned))
    }

}


class CookieIncreaseDisplay {
    constructor(value, x, y) {
        this.element = document.createElement('p')
        this.element.innerText = '+' + value
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