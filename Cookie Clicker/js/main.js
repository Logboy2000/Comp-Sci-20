const FPS = 60
var cookies = 0
var cookiesPerSecond = 0

var leftCanvas
var leftCtx
var particleCanvas = document.getElementById('foregroundParticleCanvas')
var particleCtx = particleCanvas.getContext('2d')

var canClick = true


var buildings = []
var options = {}


var upgrades = {
    cookiesPerClick: {
        cost: 100,
        value: 1
    },
}




var milk = {
    image: new Image(),
    x: 0,
    y: 0,
    width: 400,
    height: 400,
}
milk.image.src = 'images/milk/chocolate.png'



var mouse = {
    x: 0,
    y: 0
}

function go() {

    leftCanvas = document.getElementById('backgroundLeftCanvas')
    leftCtx = leftCanvas.getContext('2d')
    new TabManager()
    handleWindowResize()


    buildings = [
        new Building('Brian Griffin', 1, 1000000, 'images/buildings/brian_griffin.png'),
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
        mouse.x = event.clientX
        mouse.y = event.clientY
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
    window.addEventListener('resize', handleWindowResize)
    changeTab('options')
    createShopElements()
    createSettingsElements()

    // Create offscreen canvas
    offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = particleCanvas.width
    offscreenCanvas.height = particleCanvas.height
    offscreenCtx = offscreenCanvas.getContext('2d')

    // Load saved game
    loadGame()
    // Start update loop
    setInterval(update, 1000 / FPS)
    setInterval(autoSave, 1000 * 60)
}
var particles = [];

function update() {
    leftCtx.clearRect(0, 0, leftCtx.canvas.width, leftCtx.canvas.height)

    leftCanvas.width = leftCanvas.parentNode.offsetWidth
    leftCanvas.height = leftCanvas.parentNode.offsetHeight

    if (options.showMilk.value == true) {
        milk.x += options.milkSpeed
        milk.y = leftCanvas.height - milk.height / 2
        milk.height = leftCanvas.height / 3
        for (var x = -milk.width + (milk.x % milk.width); x < leftCanvas.width; x += milk.width) {
            leftCtx.drawImage(milk.image, x, milk.y, milk.width, milk.height)
        }
    }

    // Update and draw particles
    if (options.clearParticleCanvas.value == true) {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height)
    }
    // Removes dead particles and draws live ones
    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i]
        if (particle.isDead) {
            particles.splice(i, 1)
            i--
        } else {
            particle.update()
            particle.draw(particleCtx)
        }

    }

    upgrades.cookiesPerClick.value = Number(document.getElementById('cookiesPerClick').value)

    if (options.autoClicker == true) {
        cookieClicked()
    }

    // For every owned build, add the cookies per second to the total
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
    document.getElementById('cookiesPerSecond').innerText = 'Per second: ' + formatBigNumber(Math.floor(cookiesPerSecond))
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
        button.innerHTML = building.name + '(Owned: ' + building.owned + ')  <br> ' + formatBigNumber(building.cost) + ' Cookies'

        if (cookies >= building.cost) {
            button.disabled = false
        } else {
            button.disabled = true
        }
    }
}

function cookieClicked() {
    cookies += upgrades.cookiesPerClick.value;

    if (options.cookieParticles.value == true) {
        for (i = 0; i < upgrades.cookiesPerClick.value; i++) {
            if (i <= options.maxParticles.value) {
                particles.push(new CookieParticle(mouse.x - 5, mouse.y, randomRange(0, 360)));
            }
        }
    }
    if (options.numberParticles.value == true) {
        particles.push(new NumberIncreaseParticle());
    }
}


function createShopElements() {
    // Upgrades
    for (var i = 0; i < upgrades.length; i++) {
        const upgrade = upgrades[i]
        const buttonDiv = document.createElement('button')
        buttonDiv.id = 'product' + i
        buttonDiv.className = 'shopButton'
        buttonDiv.disabled = false
        buttonDiv.innerHTML = `${upgrade.name} (Owned: ` + upgrade.owned + `)<br> ${formatBigNumber(upgrade.cost)} cookies`
        buttonDiv.onclick = function () {
            buyUpgrade(upgrade)
        }
        document.getElementById('shop').appendChild(buttonDiv)
        document.getElementById('shop').appendChild(document.createElement('br'))
    }


    class BuildingButton {
        constructor(building, index) {
            this.building = building;
            this.element = this.createButtonElement(index);
        }

        createButtonElement(index) {
            const buttonDiv = document.createElement('button');
            buttonDiv.id = 'product' + index;
            buttonDiv.className = 'shopButtonLocked';
            buttonDiv.disabled = true;
            buttonDiv.style.backgroundImage = 'url(' + this.building.image + ')';
            buttonDiv.onclick = () => {
                buyBuilding(this.building);
            };
            return buttonDiv;
        }

        updateButton() {
            if (cookies >= this.building.cost / 5) {
                this.building.unlocked = true;
            }
            this.element.className = this.building.unlocked ? 'shopButton' : 'shopButtonLocked';
            this.element.innerHTML = `${this.building.name} (Owned: ${this.building.owned})<br>${formatBigNumber(this.building.cost)} Cookies`;
            this.element.disabled = cookies < this.building.cost;
        }
    }

    // Buildings
    for (var i = 0; i < buildings.length; i++) {
        const buildingButton = new BuildingButton(buildings[i], i);
        document.getElementById('shop').appendChild(buildingButton.element);
    }
}

class Option {
    constructor(key, value) {
        this.key = key
        this.value = value
        this.element = this.createOptionElement()
    }

    createOptionElement() {
        const settingDiv = document.createElement('div')
        settingDiv.className = 'setting-item'

        const label = document.createElement('label')
        label.textContent = this.key.charAt(0).toUpperCase() + this.key.slice(1) + ': '

        const input = document.createElement('input')
        switch (typeof this.value) {
            case 'boolean':
                input.type = 'checkbox'
                input.checked = this.value
                break
            case 'number':
                input.type = 'number'
                input.value = this.value
                break
            case 'string':
                input.type = 'text'
                input.value = this.value
                break
            default:
                break
        }
        input.id = this.key + '-setting'

        input.addEventListener('change', (e) => {
            if (typeof this.value === 'boolean') {
                this.value = e.target.checked
            } else if (typeof this.value === 'number') {
                this.value = Number(e.target.value)
            } else if (typeof this.value === 'string') {
                this.value = e.target.value
            }
            options[this.key] = this.value
        })

        label.appendChild(input)
        settingDiv.appendChild(label)
        return settingDiv
    }
}
class FunctionButton {
    constructor(text, func) {
        this.text = text
        this.func = func
        this.element = this.createButtonElement()
    }
    createButtonElement() {
        const buttonDiv = document.createElement('button')
        buttonDiv.innerHTML = `${this.text}`
        buttonDiv.onclick = this.func
        return buttonDiv
    }
}


function createSettingsElements() {
    const settingsContainer = document.getElementById('options')
    options.autoSave = new Option('autoSave', true)
    options.clearParticleCanvas = new Option('clearParticleCanvas', true)
    options.autoClicker = new Option('autoClicker', false)
    options.cookieParticles = new Option('cookieParticles', true)
    options.maxParticles = new Option('maxParticles', 30)
    options.numberParticles = new Option('numberParticles', true)
    options.formatBigNumbers = new Option('formatBigNumbers', true)
    options.showMilk = new Option('showMilk', true)
    options.milkSpeed = new Option('milkSpeed', 1)


    settingsContainer.appendChild(new FunctionButton('Save', saveGame).createButtonElement())
    settingsContainer.appendChild(new FunctionButton('WIPE SAVE', clearSaveButton).createButtonElement())


    for (var key in options) {
        settingsContainer.appendChild(options[key].element)
    }
}

function buyBuilding(building) {
    console.log(building.owned)
    if (cookies >= building.cost) {
        cookies -= building.cost
        building.owned += 1
        building.cost = Math.ceil(building.cost * Math.pow(1.01, building.owned))
    }
    console.log(building.owned)
}

function buyUpgrade(upgrade) {
    if (cookies >= upgrade.cost) {
        cookies -= upgrade.cost
        upgrade.value += 1
    }
}


function formatBigNumber(number) {
    if (options.formatBigNumbers.value == true) {
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
    return Math.random() * (max - min + 1) + min
}


function handleWindowResize() {
    // Updates canvas size based on window shape & zoom
    particleCanvas.width = particleCanvas.parentNode.clientWidth
    particleCanvas.height = window.innerHeight
}

function autoSave() {
    if (options.autoSave.value == true) {
        saveGame()
    }
}

function saveGame() {
    SaveManager.save()
    new Notification('Game Saved', 'Your progress has been saved.')
}

function loadGame() {
    if (SaveManager.load()) {
        //new Notification('Game Loaded', 'Your progress has been restored.')
    }
}
function clearSaveButton() {
    if (confirm("Are you sure? This will wipe EVERYTHING FOREVER.")) {
        new Notification('Game wiped', 'Goodbye cookies')
        setTimeout(function () {
            SaveManager.clear()
        }, 1000)


    }
}