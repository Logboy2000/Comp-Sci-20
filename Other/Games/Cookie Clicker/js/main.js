const FPS = 60;
var debug = true;

let cookies = 0;
let cookiesPerSecond = 0;

let leftCanvas;
let leftCtx;
const particleCanvas = document.getElementById('foregroundParticleCanvas');
const particleCtx = particleCanvas.getContext('2d');

let canClick = true;
let offscreenCanvas;
let offscreenCtx;

var buildings = [];

var options = {

}

var upgrades = {
    cookiesPerClick: {
        cost: 100,
        value: 1
    },
};

const milk = {
    image: new Image(),
    x: 0,
    y: 0,
    width: 400,
    height: 400,
};
milk.image.src = 'images/milk/chocolate.png';

const mouse = {
    x: 0,
    y: 0
};

function go() {
    leftCanvas = document.getElementById('backgroundLeftCanvas');
    leftCtx = leftCanvas.getContext('2d');
    new TabManager();
    handleWindowResize();

    buildings.push(
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
        new Building('Prism', 3300000000000000, 2900000000, 'images/buildings/prism.png')
    );

    document.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' && canClick) {
            canClick = false;
            cookieClicked();
        }
    });

    document.addEventListener('keyup', () => {
        canClick = true;
    });

    window.addEventListener('resize', handleWindowResize);
    changeTab('options');
    createShopElements();
    createSettingsElements();

    // Create offscreen canvas
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = particleCanvas.width;
    offscreenCanvas.height = particleCanvas.height;
    offscreenCtx = offscreenCanvas.getContext('2d');

    // Load saved game
    loadGame();
    // Start update loop
    setInterval(update, 1000 / FPS);
    setInterval(autoSave, 1000 * 60);
}

const particles = [];

function update() {
    leftCtx.clearRect(0, 0, leftCtx.canvas.width, leftCtx.canvas.height);

    leftCanvas.width = leftCanvas.parentNode.offsetWidth;
    leftCanvas.height = leftCanvas.parentNode.offsetHeight;

    if (options.showMilk) {
        milk.x += options.milkSpeed.value;
        milk.y = leftCanvas.height - milk.height / 2;
        milk.height = leftCanvas.height / 3;

        if (milk.x > leftCanvas.width){
            milk.x = 0
        }

        leftCtx.drawImage(milk.image, milk.x, milk.y, milk.width, milk.height);
        
    }

    // Update and draw particles
    if (options.clearParticleCanvas) {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    }
    // Removes dead particles and draws live ones
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (particle.isDead) {
            particles.splice(i, 1);
        } else {
            particle.update();
            particle.draw(particleCtx);
        }
    }

    upgrades.cookiesPerClick.value = Number(document.getElementById('cookiesPerClick').value);

    if (options.autoClicker === true) {
        cookieClicked();
    }

    // Calculate total cookies per second
    cookiesPerSecond = buildings.reduce((total, building) => {
        const buildingCPS = building.owned * building.cookiesPerSecond;
        cookies += buildingCPS / FPS;
        return total + buildingCPS;
    }, 0);

    updateShop();
    cookiesPerSecond = parseFloat(cookiesPerSecond.toFixed(2));
    document.getElementById('cookiesPerSecond').innerText = 'Per second: ' + formatBigNumber(Math.floor(cookiesPerSecond));
    document.getElementById('cookieCount').innerText = `${formatBigNumber(Math.floor(cookies))} ${cookies === 1 ? 'cookie' : 'cookies'}`;
    document.getElementById('tabTitle').innerText = `${document.getElementById('cookieCount').innerText} - Cockie Clorker`;
}

function updateShop() {
    buildings.forEach((building, i) => {
        const button = document.getElementById('product' + i);
        if (cookies >= building.cost / 5) {
            building.unlocked = true;
        }
        button.className = building.unlocked ? 'shopButton' : 'shopButtonLocked';
        button.innerHTML = `${building.name}(Owned: ${building.owned}) <br> ${formatBigNumber(building.cost)} Cookies`;
        button.disabled = cookies < building.cost;
    });
}

function cookieClicked() {
    cookies += upgrades.cookiesPerClick.value;

    if (options.cookieParticles.value === true) {
        const particlesToCreate = Math.min(upgrades.cookiesPerClick.value, options.maxParticles.value);
        for (let i = 0; i < particlesToCreate; i++) {
            particles.push(new CookieParticle(mouse.x - 5, mouse.y, randomRange(0, 360)));
        }
    }
    if (options.numberParticles.value === true) {
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
    options.autoSave = new Option('Auto Save', true)
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
    if (options.formatBigNumbers === true) {
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

class Particle {
    constructor(x, y, r, opacity) {
        this.x = x
        this.y = y
        this.r = r
        this.opacity = opacity
        this.isDead = false
    }
    update() {
        // This method should be overridden
    }
    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.opacity)
        ctx.save()
        this.drawContent(ctx)
        ctx.restore()
        ctx.globalAlpha = 1
    }

    drawContent(ctx) {
        // This method should be overridden
    }
}

class ImageParticle extends Particle {
    constructor(x, y, r, opacity, imageSrc) {
        super(x, y, r, opacity)
        this.image = new Image()
        this.image.src = imageSrc
    }
    drawContent(ctx) {
        // Image drawing logic here
    }
}

class TextParticle extends Particle {
    constructor(x, y, r, opacity, text) {
        super(x, y, r, opacity)
        this.text = text
    }
}


class NumberIncreaseParticle extends TextParticle {
    constructor() {
        super(mouse.x, mouse.y, 0, 1, '+' + formatBigNumber(upgrades.cookiesPerClick.value))
        this.ySpeed = -1
    }

    update() {
        this.opacity -= 0.01
        this.y += this.ySpeed
        if (this.opacity <= 0) {
            this.isDead = true
        }
    }

    drawContent(ctx) {
        ctx.font = '16px Arial'
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.textAlign = 'center'
        ctx.fillText(this.text, this.x, this.y)
    }
}
class CookieParticle extends ImageParticle {
    constructor() {
        super(mouse.x, mouse.y, randomRange(0, 360), 1, 'images/particles/cookie.png')
        this.xSpeed = randomRange(-10, 10)
        this.ySpeed = randomRange(-10, 0)
        this.rSpeed = randomRange(-10, 10)
        this.gravity = 0.5
    }

    update() {
        this.opacity -= 0.02
        this.r += this.rSpeed

        this.ySpeed += this.gravity
        this.x += this.xSpeed
        this.y += this.ySpeed

        if (this.opacity <= 0) {
            this.isDead = true
        }
    }

    drawContent(ctx) {
        ctx.translate(this.x, this.y)
        ctx.rotate(this.r * Math.PI / 180)
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2)
    }
}
class Notification {
    constructor(title, description, timeout = 2000) {
        this.element = document.createElement('div')
        this.element.onclick = () => {
            this.slideOut()
        }

        this.title = document.createElement('label')
        this.title.innerText = title
        this.element.appendChild(this.title)

        this.description = document.createElement('p')
        this.description.innerText = description
        this.element.appendChild(this.description)

        this.element.className = 'notification'
        this.element.style.opacity = 1
        this.element.style.transform = 'translateX(-100%)'
        document.getElementById('notificationContainer').insertBefore(this.element, document.getElementById('notificationContainer').firstChild)

        // Slide in animation
        setTimeout(() => {
            this.element.style.transition = 'transform 0.5s ease-out'
            this.element.style.transform = 'translateX(0)'
        }, 50)

        setTimeout(() => {
            this.slideOut()
        }, timeout)
    }
    slideOut() {
        this.element.style.transition = 'transform 0.5s ease-in'
        this.element.style.transform = 'translateX(-100%)'
        setTimeout(() => {
            this.element.remove()
        }, 500)
    }
}

class TabManager {
    constructor() {
        this.tabsContainer = document.getElementById('tabs');
        this.tabs = Array.from(this.tabsContainer.children).map(div => div.id);
        this.currentTab = this.tabs[0];
        this.generateTabButtons();
        this.initTabs();
    }

    generateTabButtons() {
        const tabbedMenu = document.getElementById('tabbedMenu');
        this.tabs.forEach(tabId => {
            const button = document.createElement('button');
            button.className = 'tabButton';
            button.id = `${tabId}Tab`;
            button.textContent = this.capitalizeFirstLetter(tabId);
            button.addEventListener('click', () => this.changeTab(tabId));
            tabbedMenu.insertBefore(button, this.tabsContainer);
        });
        const separator = document.createElement('div');
        separator.id = 'separatorH';
        tabbedMenu.insertBefore(separator, this.tabsContainer);

    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    initTabs() {
        this.showTab(this.currentTab);
    }

    changeTab(tabName) {
        this.hideAllTabs();
        this.showTab(tabName);
        this.currentTab = tabName;
    }

    hideAllTabs() {
        this.tabs.forEach(tab => {
            document.getElementById(tab).style.display = 'none';
        });
    }

    showTab(tabName) {
        document.getElementById(tabName).style.display = 'block';
    }
}

class SaveManager {
    static save() {
        const simplifiedBuildings = buildings.map(building => ({
            name: building.name,
            owned: building.owned,
            unlocked: building.unlocked
        }));

        const gameState = {
            cookies: cookies,
            cookiesPerSecond: cookiesPerSecond,
            buildings: simplifiedBuildings,
            upgrades: upgrades,
            options: options,
            timestamp: Date.now()
        };
        localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
    }

    static load() {
        const savedState = localStorage.getItem('cookieClickerSave');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            const currentTime = Date.now();
            const elapsedSeconds = (currentTime - gameState.timestamp) / 1000;

            const cookiesWhileGone = gameState.cookiesPerSecond * elapsedSeconds;
            cookies = gameState.cookies + cookiesWhileGone;
            cookiesPerSecond = gameState.cookiesPerSecond;

            // Reconstruct buildings
            buildings.forEach(building => {
                const savedBuilding = gameState.buildings.find(b => b.name === building.name);
                if (savedBuilding) {
                    building.owned = savedBuilding.owned;
                    building.unlocked = savedBuilding.unlocked;
                    building.cost = Math.ceil(building.cost * Math.pow(1.01, building.owned));
                }
            });

            upgrades = gameState.upgrades;
            options = gameState.options;

            // Add the welcome back notification
            new Notification('Welcome back!', 'You earned ' + formatBigNumber(Math.floor(cookiesWhileGone)) + ' cookies while you were away.', 10000);

            return true;
        }
        return false;
    } static clear() {
        localStorage.removeItem('cookieClickerSave');
        location.reload();
    }
}


function testNotification() {
    new Notification("Test Title", "Test Desc");
}

function unlockAll() {
    for (var i = 0; i < buildings.length; i++) {
        buildings[i].unlocked = true
    }
}


class Settings {
    constructor() {
        this.settings = {};
        this.load();
    }

    load() {
        const saved = localStorage.getItem('settings');
        if (saved) {
            this.settings = JSON.parse(saved);
        }
    }

    save() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    create(key, defaultValue, options = {}) {
        if (!(key in this.settings)) {
            this.settings[key] = defaultValue;
        }

        if (options.createHTML) {
            const container = document.createElement('div');
            container.className = 'setting-item';
            
            const label = document.createElement('label');
            label.textContent = options.label || key;
            container.appendChild(label);

            let input;
            switch (typeof defaultValue) {
                case 'boolean':
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = this.settings[key];
                    input.addEventListener('change', () => {
                        this.set(key, input.checked);
                    });
                    break;
                    
                case 'number':
                    input = document.createElement('input');
                    input.type = 'number';
                    input.value = this.settings[key];
                    input.addEventListener('change', () => {
                        this.set(key, parseFloat(input.value));
                    });
                    break;
                    
                default:
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = this.settings[key];
                    input.addEventListener('change', () => {
                        this.set(key, input.value);
                    });
            }
            
            container.appendChild(input);
            
            if (options.parent) {
                options.parent.appendChild(container);
            }
            
            return container;
        }
    }

    get(key) {
        return this.settings[key];
    }

    set(key, value) {
        this.settings[key] = value;
        this.save();
    }
}

// Initialize settings
const settings = new Settings();
