var currentAnswerArray = []
var currentGuessArray = []

var wrongPicks = 0

var api = 'https://random-word.ryanrk.com/api/en/word/random/'

var gameStates = {
	PLAYING: 0,
	FETCHING: 1,
	ANSWER_SHOWN: 2,
	GAME_OVER: 3,
	GAME_WON: 4,
}

var gameState = gameStates.PLAYING

function go() {
	document.getElementById('apiURL').href = api
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

	fetch(api + '?length=' + length)
		.then(res => res.json()) // Convert JSON into variable
		.then(data => {
			// Update word
			changeWord(data[0])
		})
		.catch(err => {
			// Display error
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

function displayAnswerArray(array, elementId) {
	document.getElementById(elementId).innerHTML = ''
	for (i = 0; i < array.length; i++) {
		document.getElementById(elementId).innerHTML += ' ' + array[i] + ' '
	}
}

function keyPressed(key) {
	key = key.toUpperCase()
	if (gameState == gameStates.PLAYING) {
		// Hide button
		document.getElementById(key).className = 'buttonDisabled'
		document.getElementById(key).onclick = () => ""
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
		displayAnswerArray(currentGuessArray, 'word')







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
	const keysQwerty = [
		'~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+',
		'`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
		'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\',
		'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', ';', '\'',
		'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '?'
	];

	var keys = keysQwerty
	var lettersDiv = document.getElementById('letters')
	// Loop through all keys in the array

	keys.forEach(key => {
		// Create button
		const button = document.createElement('button')
		button.className = 'button'
		// Modify button
		button.textContent = key
		button.onclick = () => keyPressed(key)
		button.id = key

		// Append created button
		lettersDiv.appendChild(button)
		if (key == '\'') {
			button.textContent = 'Answer'
			button.onclick = () => showAnswer()
			button.id = 'showAnswerButton'
			button.className = 'button'
			lettersDiv.appendChild(button)
		}
		if (key == '+' || key == '=' || key == '\\' || key == '\'') {
			lettersDiv.appendChild(document.createElement('br'))
		}

	})



}

function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function showAnswer() {
	gameState = gameStates.ANSWER_SHOWN
	displayAnswerArray(currentAnswerArray, 'word')
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
	displayAnswerArray(currentGuessArray, 'word')
	removeKeys()
	generateKeys()
	document.getElementById('word').style.color = '#FFFFFF'
	gameState = gameStates.PLAYING
}