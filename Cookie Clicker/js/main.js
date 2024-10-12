const FPS = 60
var cookies = 0
var cookiesPerSecond = 0

var leftCanvas
var ctx

var canClick = true

var buildings = []

var upgrades = {
    cookiesPerClick: {
        cost: 100,
        value: 1
    },
}


var options = {
    autoClicker: false,
    cookieParticles: true,
    numberParticles: true,
    formatBigNumbers: true,
    milk: true,
    milkSpeed: 1,
}

var milk = {
    image: new Image(),
    x: 0,
    y: 0,
    width: 400,
    height: 400,
}
milk.image.src = 'images/milk/plain.png'



var mouse = {
    x: 0,
    y: 0
}

function go() {
    leftCanvas = document.getElementById('backgroundLeftCanvas')
    ctx = leftCanvas.getContext('2d')



    buildings = [
        new Building('Cursor', 15, 0.2, 'images/buildings/cursor.png'),
        new Building('Grandma', 100, 1, 'images/buildings/grandma.png'),
        new Building('Farm', 1100, 8, 'images/buildings/farm.png'),
        new Building('Mine', 12000, 47, 'images/buildings/mine.png'),
        new Building('Factory', 130000, 260, 'images/buildings/factory.png'),
        new Building('Bank', 1400000, 1400, 'images/buildings/bank.png'),
        new Building('Temple', 20000000, 7800, 'images/buildings/temple.png'),
        new Building('Wizard tower', 330000000, 44000, 'images/buildings/wizard_tower.png'),
        new Building('Shipment', 5100000000, 260000, 'images/buildings/shipment.png'),
        new Building('Alchemy lab', 76000000000, 1600000, 'images/buildings/alchemy_lab.png'),
        new Building('Portal', 1100000000000, 10000000, 'images/buildings/portal.png'),
        new Building('Time machine', 16000000000000, 65000000, 'images/buildings/time_machine.png'),
        new Building('Antimatter condenser', 230000000000000, 430000000, 'images/buildings/antimatter_condenser.png'),
        new Building('Prism', 3300000000000000, 2900000000, 'images/buildings/prism.png'),
    ]

    document.addEventListener('mousemove', function (event) {
        mouse.x = event.clientX - 10
        mouse.y = event.clientY - 20
    })

    document.addEventListener('keydown', function (event) {





        switch (event.key) {
            case ' ': // Spacebar
                if (canClick) {
                    canClick = false
                    cookieClicked()
                }
                break
        }
    })
    document.addEventListener('keyup', function (event) {
        canClick = true
    })
    changeTab('options')
    createShopElements()
    createSettingsElements()
    setInterval(update, 1000 / FPS)

}

function update() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    leftCanvas.width = leftCanvas.parentNode.offsetWidth
    leftCanvas.height = leftCanvas.parentNode.offsetHeight


    if (options.milk == true) {
        milk.x += options.milkSpeed
        milk.y = leftCanvas.height - milk.height/2
        for (var x = -milk.width + (milk.x % milk.width); x < leftCanvas.width; x += milk.width) {
            ctx.drawImage(milk.image, x, milk.y, milk.width, milk.height)
        }
    }


    upgrades.cookiesPerClick.value = Number(document.getElementById('cookiesPerClick').value)

    if (options.autoClicker == true) {
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











    updateShop()
    cookiesPerSecond = parseFloat(cookiesPerSecond.toFixed(2))
    document.getElementById('cookiesPerSecond').innerText = 'Per second: ' + cookiesPerSecond
    if (cookies == 1) {
        document.getElementById('cookieCount').innerText = formatBigNumber(Math.floor(cookies)) + ' cookie'
    } else {
        document.getElementById('cookieCount').innerText = formatBigNumber(Math.floor(cookies)) + ' cookies'
    }
    document.getElementById('tabTitle').innerText = document.getElementById('cookieCount').innerText + ' - Cockie Clorker'
}

function updateShop() {
    for (var i = 0; i < buildings.length; i++) {
        var button = document.getElementById('product' + i)
        var building = buildings[i]
        if (cookies >= building.cost / 5) {
            building.unlocked = true
        }
        if (building.unlocked == true) {
            button.className = 'shopButton'
        } else {
            button.className = 'shopButtonLocked'
        }



        button.innerHTML = `${building.name} (Owned: ` + building.owned + `)<br> ${formatBigNumber(building.cost)} cookies`

        if (cookies >= building.cost) {
            button.disabled = false
        } else {
            button.disabled = true
        }
    }
}


function cookieClicked() {
    cookies += upgrades.cookiesPerClick.value
    if (options.cookieParticles == true) {
        for(i=0;i<upgrades.cookiesPerClick.value;i++){
            if(i>15){i = upgrades.cookiesPerClick.value}
            new CookieParticle(mouse.x - 5, mouse.y, randomRange(0, 360))
        }
        
    }
    if (options.numberParticles == true) {
        const cookieIncreaseDisplay = new CookieIncreaseDisplay(upgrades.cookiesPerClick.value, mouse.x, mouse.y)
        cookieIncreaseDisplay.appendTo(document.getElementById('cookieContainer'))
    }
}
function createShopElements() {
    // Upgrades
    for (var i = 0; i < upgrades.length; i++) {
        const upgrade = upgrades[i];
        const buttonDiv = document.createElement('button')
        buttonDiv.id = 'product' + i
        buttonDiv.className = 'shopButton'
        buttonDiv.disabled = false
        buttonDiv.innerHTML = `${upgrade.name} (Owned: ` + upgrade.owned + `)<br> ${formatBigNumber(upgrade.cost)} cookies`
        buttonDiv.onclick = function () {
            buyUpgrade(upgrade)
        }
        document.getElementById('shop').appendChild(buttonDiv)
    }


    // Buildings
    for (var i = 0; i < buildings.length; i++) {
        const building = buildings[i];
        const buttonDiv = document.createElement('button')
        buttonDiv.id = 'product' + i
        buttonDiv.className = 'shopButtonLocked'
        buttonDiv.disabled = true
        buttonDiv.style.backgroundImage = 'url(' + building.image + ')'
        buttonDiv.onclick = function () {
            buyBuilding(building)
        }
        document.getElementById('shop').appendChild(buttonDiv)
    }
}
function createSettingsElements() {
    const settingsContainer = document.getElementById('options')

    for (const [key, value] of Object.entries(options)) {
        const settingDiv = document.createElement('div')
        settingDiv.className = 'setting-item'

        const label = document.createElement('label')
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ': '

        const input = document.createElement('input')
        switch (typeof value) {
            case 'boolean':
                input.type = 'checkbox'
                input.checked = value
                break
            case 'number':
                input.type = 'number'
                input.value = value
                break
            case 'string':
                input.type = 'text'
                input.value = value
                break
            default:
                break
        }
        input.id = key + '-setting'

        input.addEventListener('change', (e) => {
            if (typeof value === 'boolean') {
                options[key] = e.target.checked
            } else if (typeof value === 'number') {
                options[key] = Number(e.target.value)
            } else if (typeof value === 'string') {
                options[key] = e.target.value
            }
        })

        label.appendChild(input)
        settingDiv.appendChild(label)
        settingsContainer.appendChild(settingDiv)
    }
}

function buyBuilding(building) {
    if (cookies >= building.cost) {
        cookies -= building.cost
        building.owned += 1
        building.cost = Math.ceil(building.cost * Math.pow(1.05, building.owned))
    }
}

function buyUpgrade(upgrade) {
    if (cookies >= upgrade.cost) {
        cookies -= upgrade.cost
        upgrade.value += 1
    }
}


function formatBigNumber(number) {
    if (options.formatBigNumbers == true) {
        const suffixes = ['', 'K', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion', 'Quattuordecillion', 'Quindecillion', 'Sexdecillion', 'Septendecillion', 'Octodecillion', 'Novemdecillion', 'Vigintillion', 'Unvigintillion', 'Duovigintillion', 'Trevigintillion', 'Quattuorvigintillion', 'Quinvigintillion', 'Sexvigintillion', 'Septenvigintillion', 'Octovigintillion', 'Novemvigintillion', 'Trigintillion', 'Untrigintillion', 'Duotrigintillion', 'Googol']
        if (number < 1000000) {
            return number.toString()
        }
        if (number >= 10 ** 100) {
            return 'Googol or more'
        }

        let tier = Math.log10(Math.abs(number)) / 3 | 0
        if (tier == 0) return number.toString()

        let suffix = suffixes[tier]
        let scale = Math.pow(10, tier * 3)
        let scaled = number / scale

        return parseFloat(scaled.toFixed(2)) + ' ' + suffix
    }
    return number.toString()
}


function changeTab(tabID) {
    for (var i = 0; i < document.getElementById('tabs').children.length; i++) {
        document.getElementById('tabs').children[i].style.display = 'none'
    }
    document.getElementById(tabID).style.display = 'inline'
    document.getElementById(tabID + 'Tab').className = 'tabButton'

}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}