-- Constants
local WINDOW_WIDTH = 800
local WINDOW_HEIGHT = 600
local BACKGROUND_COLOR = {0.2, 0.2, 0.2}
local FONT_SIZE = 24
local TIME_OPTIONS = {5, 10, 15, 30, 60}
local DEFAULT_TIME_INDEX = 2

-- Game state
local GameState = {
    READY = "ready",
    PLAYING = "playing",
    FINISHED = "finished"
}

-- Game data
local game = {
    clicks = 0,
    timer = 0,
    state = GameState.READY,
    selectedTime = TIME_OPTIONS[DEFAULT_TIME_INDEX],
    currentTimeIndex = DEFAULT_TIME_INDEX,
    font = nil
}

-- UI functions
local function drawReady()
    love.graphics.printf("Press enter to start!", 0, 250, love.graphics.getWidth(), "center")
    love.graphics.printf("Press UP/DOWN to change timer: " .. game.selectedTime .. "s", 0, 350, love.graphics.getWidth(), "center")
end

local function drawPlaying()
    love.graphics.printf("Clicks: " .. game.clicks, 0, 200, love.graphics.getWidth(), "center")
    love.graphics.printf("Time: " .. string.format("%.1f", game.selectedTime - game.timer), 0, 300, love.graphics.getWidth(), "center")
end

local function drawFinished()
    love.graphics.printf("Final Score: " .. game.clicks .. " clicks", 0, 200, love.graphics.getWidth(), "center")
    love.graphics.printf("CPS: " .. string.format("%.1f", game.clicks/game.selectedTime), 0, 300, love.graphics.getWidth(), "center")
    love.graphics.printf("Press enter to return to title!", 0, 400, love.graphics.getWidth(), "center")
end

-- Game functions
local function resetGame()
    game.clicks = 0
    game.timer = 0
end

local function updateTimeSelection(direction)
    if direction == "up" then
        game.currentTimeIndex = math.min(game.currentTimeIndex + 1, #TIME_OPTIONS)
    else
        game.currentTimeIndex = math.max(game.currentTimeIndex - 1, 1)
    end
    game.selectedTime = TIME_OPTIONS[game.currentTimeIndex]
end

local function handleClick()
    if game.state == GameState.PLAYING then
        game.clicks = game.clicks + 1
    end
end

-- Love2D callbacks
function love.load()
    love.window.setMode(WINDOW_WIDTH, WINDOW_HEIGHT)
    love.graphics.setBackgroundColor(unpack(BACKGROUND_COLOR))
    game.font = love.graphics.newFont(FONT_SIZE)
    love.graphics.setFont(game.font)
end

function love.update(dt)
    if game.state == GameState.PLAYING then
        game.timer = game.timer + dt
        if game.timer >= game.selectedTime then
            game.state = GameState.FINISHED
        end
    end
end

function love.draw()
    if game.state == GameState.READY then
        drawReady()
    elseif game.state == GameState.PLAYING then
        drawPlaying()
    elseif game.state == GameState.FINISHED then
        drawFinished()
    end
end

function love.mousepressed(x, y, button, istouch, presses)
    if button == 1 then
        handleClick()
    end
end

function love.keypressed(key)
    if game.state == GameState.READY then
        if key == "up" then
            updateTimeSelection("up")
        elseif key == "down" then
            updateTimeSelection("down")
        elseif key == "return" then
            resetGame()
            game.state = GameState.PLAYING
        end
    elseif game.state == GameState.FINISHED and key == "return" then
        game.state = GameState.READY
    end

    if key == "space" then
        handleClick()
    end
end