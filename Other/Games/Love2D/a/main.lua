local love = require("love")

local game = {
    states = {
        menu = 0,
        play = 1,
        pause = 2,
        gameover = 3,
    },
    state = 0,
    score = 0
}

-- Asteroid class/object template
local Asteroid = {}
Asteroid.__index = Asteroid

function Asteroid.new(x, y, radius)
    local self = setmetatable({}, Asteroid)
    self.x = x or 0
    self.y = y or 0
    self.radius = radius or 30
    self.speed = 100
    self.destroyKey = string.char(math.random(97, 122)) -- Random lowercase letter (a-z)
    return self
end

function Asteroid:update(dt)
    self.y = self.y + self.speed * dt
    
    -- Check if asteroid reached bottom of screen
    if self.y > love.graphics.getHeight() + self.radius then
        game.state = game.states.gameover
    end
end

function Asteroid:draw()
    love.graphics.push()
    love.graphics.translate(self.x, self.y)
    love.graphics.circle("line", 0, 0, self.radius)
    love.graphics.print(self.destroyKey, -5, -8) -- Display the key inside the asteroid
    love.graphics.pop()
end

-- Example of creating and storing asteroids
local asteroids = {}

function love.load()
    game.state = game.states.play
end

function love.update(dt)
    if game.state == game.states.play then
        -- Update all asteroids
        for _, asteroid in ipairs(asteroids) do
            asteroid:update(dt)
        end
        -- Create a new asteroid every second
        if not timer then timer = 0 end
        timer = timer + dt
        if timer >= 1 then
            timer = timer - 1
            local newAsteroid = Asteroid.new(math.random(0, love.graphics.getWidth()), -50)
            table.insert(asteroids, newAsteroid)
        end
    end
end

function love.draw()
    -- Draw all asteroids
    for _, asteroid in ipairs(asteroids) do
        asteroid:draw()
    end
    love.graphics.print("FPS: " .. love.timer.getFPS(), 0, 10)
    love.graphics.print("Score: " .. game.score, 0, 30)
    
    if game.state == game.states.gameover then
        love.graphics.setColor(1, 0, 0)
        love.graphics.printf("GAME OVER\nFinal Score: " .. game.score, 0, love.graphics.getHeight() / 2 - 40, love.graphics.getWidth(), "center")
        love.graphics.setColor(1, 1, 1)
    end
end

function love.keypressed(key)
    if key == 'escape' then
        love.event.quit()
    end
    
    if game.state == game.states.play then
        local keyFound = false
        -- Check if the pressed key matches any asteroid's destroy key
        for i = #asteroids, 1, -1 do
            if key == asteroids[i].destroyKey then
                table.remove(asteroids, i)
                game.score = game.score + 1
                keyFound = true
                break
            end
        end
        
        -- If wrong key was pressed
        if not keyFound and key ~= 'escape' then
            game.state = game.states.gameover
        end
    end
end