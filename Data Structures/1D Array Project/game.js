var currentAnswerArray = []
var currentGuessArray = []

var wrongPicks = 0


var gameStates = {
	PLAYING: 0,
	FETCHING: 1,
	ANSWER_SHOWN: 2,
	GAME_OVER: 3,
	GAME_WON: 4,
}

var gameState = gameStates.PLAYING

function go() {
	generateKeys()
	randomWordButton()
}



function stringToArray(string) {
	var outputArray = []
	var originalString = string
	for (i = 0; i < originalString.length; i++) {
		outputArray[i] = string.charAt(0)
		string = string.slice(1)
	}
	return outputArray
}


async function fetchRandomWord(length) {
	document.getElementById('word').innerHTML = 'Fetching word, please wait'

	fetch('https://random-word-api.herokuapp.com/word?length=' + length)
		.then(res => res.json())
		.then(data => {
			changeWord(data[0])
		})
		.catch(err => {
			document.getElementById('word').innerHTML = 'Word not found, try another length'
		})

}


function searchArray(array, valueToFind) {
	var i
	for (i = 0; i < array.length; i++) {
		if (array[i] == valueToFind) {
			return true
		}
	}
	return false
}

function displayArray(array, elementId) {
	document.getElementById(elementId).innerHTML = ''
	for (i = 0; i < array.length; i++) {
		document.getElementById(elementId).innerHTML += ' ' + array[i] + ' '
	}
}

function keyPressed(key) {
	if (gameState == gameStates.PLAYING) {
		// Hide button
		document.getElementById(key).style.display = 'none'

		// Check for game loss
		var isKeyCorrect = false
		for (i = 0; i < currentAnswerArray.length; i++) {
			if (currentAnswerArray[i] == key) {
				currentGuessArray[i] = key
				isKeyCorrect = true
			}
		}
		if (isKeyCorrect == false) {
			wrongPicks += 1
			document.getElementById('hangman').setAttribute('src', 'images/hangman' + wrongPicks + '.png')
			if (wrongPicks >= 6) {
				gameState = gameStates.GAME_OVER
			}
		}
		// Check for game won
		if (searchArray(currentGuessArray, '__') == false) {
			gameState = gameStates.GAME_WON
		}



		switch (gameState) {
			case gameStates.PLAYING:

				break
			case gameStates.FETCHING:

				break
			case gameStates.ANSWER_SHOWN:

				break
			case gameStates.GAME_OVER:
				document.getElementById('word').style.color = '#FF0000'
				break
			case gameStates.GAME_WON:
				document.getElementById('word').style.color = '#00FF00'
				break
		}

		if (currentGuessArray == currentAnswerArray) {
			document.getElementById('word').style.color = '#00FF00'
		}
		displayArray(currentGuessArray, 'word')







	}
}
function removeKeys() {
	var keyboardDiv = document.getElementById('letters')
	while (keyboardDiv.firstChild) {
		keyboardDiv.removeChild(keyboardDiv.firstChild)
	}

}
function generateKeys() {
	// Generate keyboard buttons dynamically (wOwIe!!)
	const keysAlphabetical = [
		'1','2','3','4','5','6','7','8','9','0',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
		'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
		'U', 'V', 'W', 'X', 'Y', 'Z'
	];
	var keys = keysAlphabetical
	var lettersDiv = document.getElementById('letters')
	// Loop through all keys in the array
	keys.forEach(key => {
		// Create button
		const button = document.createElement('button')
		// Modify button
		button.textContent = key
		button.onclick = () => keyPressed(key)
		button.id = key
		// Append created button
		lettersDiv.appendChild(button)
		if (key == '0'){
			lettersDiv.appendChild(document.createElement('br'))
		}
	});

	const showAnswerButton = document.createElement('button')
	showAnswerButton.textContent = 'Show Answer'
	showAnswerButton.onclick = () => showAnswer()
	showAnswerButton.id = 'showAnswerButton'
	lettersDiv.appendChild(showAnswerButton)

}

function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function showAnswer() {
	gameState = gameStates.ANSWER_SHOWN
	displayArray(currentAnswerArray, 'word')
}

function randomWordButton() {
	var length = document.getElementById('lengthInput').value
	if (length == '') {
		length = randomRange(3, 10)
	}

	gameState = gameStates.FETCHING

	fetchRandomWord(length)

}

function customWordButton() {
	if (document.getElementById('customAnswerInput').value == '') { return }
	changeWord(document.getElementById('customAnswerInput').value)
	document.getElementById('customAnswerInput').value = ''
}


function changeWord(word) {
	wrongPicks = 0
	document.getElementById('hangman').setAttribute('src', 'images/hangman' + wrongPicks + '.png')
	currentAnswerArray = stringToArray(word.toUpperCase())
	document.getElementById('word').innerHTML = ''
	currentGuessArray = []
	for (i = 0; i < currentAnswerArray.length; i++) {
		if (currentAnswerArray[i] == ' ') {
			currentGuessArray[i] = '\xa0'
		} else {
			currentGuessArray[i] = '__'
		}

	}
	displayArray(currentGuessArray, 'word')
	removeKeys()
	generateKeys()
	document.getElementById('word').style.color = '#FFFFFF'
	gameState = gameStates.PLAYING
}