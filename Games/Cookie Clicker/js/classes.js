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