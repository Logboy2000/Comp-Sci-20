var c
var ctx
var mole



function start() { // start of StartIt
	canvas = document.getElementById("canvas")
	context = canvas.getContext("2d")
	mole = new Image();

	mole.onload = function () {
		context.drawImage(mole, 0, 0);
	};
	mole.src = 'images/mole.png';
	canvas.addEventListener('click', function (event) {
		var clickX = event.pageX - canvas.offsetLeft
		var clickY = event.pageY - canvas.offsetTop

		checkCollision()
		
	}, false);// end of event listener for click
}// end of start()



function checkCollision(){
	if (clickX >= mole.x && clickX <= mole.x + mole.width && clickY >= mole.y && clickY <= mole.y + mole.height) {
		return true
	}
	return false
}


function randomRange(min, max) {
    return ((Math.random() * (max - min)) + min)
}// end of randomRanger