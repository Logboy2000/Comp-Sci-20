function go() {// start of go
    // define canvases
    var canvas1 = document.getElementById("can1")
    var ctx1 = canvas1.getContext("2d")
    var canvas2 = document.getElementById("can2")
    var ctx2 = canvas2.getContext("2d")
    var canvas3 = document.getElementById("can3")
    var ctx3 = canvas3.getContext("2d")

    // Challenge 1
    rectangle(ctx1, 5, 7, 60, 30, "black")
    rectangle(ctx1, 250, 7, 30, 100, "green")
    rectangle(ctx1, 350, 40, 100, 150, "purple")

    // Challenge 2
    ctx2.globalAlpha = 0.75;
    circle(ctx2, 250, 70, 50, "red")
    circle(ctx2, 220, 120, 50, "green")
    circle(ctx2, 280, 120, 50, "blue")

    // Challenge 3
    smileyFace(ctx3, 100, 100, true, "purple")
    smileyFace(ctx3, 300, 100, false, "orange")
    smileyFace(ctx3, 500, 100, false, "blue")

    // Challenges 4-6 are triggered by buttons
}// end of go
function rectangle(context, x, y, w, h, color) {
    context.beginPath()
    context.rect(x, y, w, h)
    context.fillStyle = color
    context.fill()
    context.closePath()
}// end of rectangle

function circle(context, x, y, radius, color, fill = true, half_circle = false) {
    context.beginPath()
    if (half_circle) {
        context.arc(x, y, radius, 0, 1 * Math.PI)
    } else {
        context.arc(x, y, radius, 0, 2 * Math.PI)
    }
    context.closePath()
    context.fillStyle = color
    if (fill) {
        context.fill()
    } else {
        context.stroke()
    }
}// end of circle


function smileyFace(context, x, y, two_eyes, skin_color = "blue") {
    circle(context, x, y, 100, skin_color)
    circle(context, x, y + 30, 50, "black", true, true)
    if (two_eyes) {
        // left eye
        circle(context, x - 30, y - 30, 25, "white")
        circle(context, x - 30, y - 30, 15, "black")
        // right eye
        circle(context, x + 30, y - 30, 25, "white")
        circle(context, x + 30, y - 30, 15, "black")
    } else {
        // one big eye
        circle(context, x, y - 30, 50, "white")
        circle(context, x, y - 30, 25, "black")
    }
}// end of smileyFace


function areaOfCircle(radius) {
    return Math.PI * radius ^ 2
}// end of areaOfCircle


function random(min, max) {
    return ((Math.random() * (max - min)) + min)
}// end of random

function isWeekend(day) {
    if (day == "Sunday" || day == "Saturday") {
        return true
    } else {
        return false
    }
}// end of isWeekend

//Functions are run when the respective button is clicked
function calculateAreaButton() {
    var areaInput = document.getElementById("areaInput").value
    document.getElementById("areaOutput").innerHTML = "Area = " + areaOfCircle(areaInput) + "cm"
    var storedValue = areaOfCircle(areaInput)
}// end of calculateAreaButton

function randomNumberButton() {
    var min = parseFloat(document.getElementById("minRandomInput").value)
    var max = parseFloat(document.getElementById("maxRandomInput").value)
    document.getElementById("randomOutput").innerHTML = "Random Number = " + random(min, max)
    var storedValue = random(1, 5)
}// end of randomAreaButton

function isWeekendButton() {
    var currentDay = document.getElementById("daysDropdown").value
    if (isWeekend(currentDay)) {
        document.getElementById("weekendOutput").innerHTML = "It's the weekend!"
    } else {
        document.getElementById("weekendOutput").innerHTML = "It's not the weekend"
    }
    var storedValue = isWeekend(currentDay)
}// end of isWeekendButton

/*

Challenge 1 - create a function that draws a rectangle on a canvas.
Does this function have an output?
How many input parameters should this function have to maximize it's reusability?  Call this function 3 times from the go function to draw different rectangles on the canvas.

Challenge 2 - create a function that draws a circle on a canvas.
Does this function have an output?
How many input parameters should this function have to maximize it's reusability?  Call this function 3 times from the go function to draw different circles on the canvas.

Challenge 3 - create a functoin that draws a face on a canvas.Does this function have an output?
How many input parameters should this function have to maximize it's reusability?  Call this function 3 times from the go function to draw different rectangles on the canvas.

Challenge 4 - create a funciton that calculates the area of a circle https://www.w3schools.com/jsref/jsref_pi.asp shows you how to get pi but 3.14 is acceptable.  
How many input parameters should this function have to maximize it's reusability?  
Call the function and deal with the output in 2 different ways from the go function.

Challenge 5 - create a funciton that generates a random number.
How many input parameters should this function have to maximize it's reusability?  
Call the function and deal with the output in 3 different ways from the go function.

Challenge 6 - create a function that returns true if it is the weekend and false if it is not ... call it isWeekend.  How many parameters should this function have to maximize it's reusability?
Call the function and deal with the output in 2 different ways from the go function

*/
