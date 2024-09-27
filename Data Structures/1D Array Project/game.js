var currentAnswerArray = []
var currentAnswerString = ''

var currentWordArray = []

var isFetching = false

function go() {
	generateKeys()
	fetchRandomWord()
}

var twoDee = [
	[1,2,3],
	[4,5,6],
	[7,8,9]
]


function stringToArray(string) {
	var outputArray = []
	var originalString = string
	for (i = 0; i < originalString.length; i++) {
		outputArray[i] = string.charAt(0)
		string = string.slice(1)
	}
	return outputArray
}


function fetchRandomWord() {
	var length = document.getElementById('lengthInput').value
	if (length == '') {
		length = randomRange(2, 10)
	}
	if (!isFetching) {
		isFetching = true
		document.getElementById('word').innerHTML = 'Fetching word, please wait'
		fetch('https://random-word-api.herokuapp.com/word?length=' + length)
			.then(res => res.json())
			.then(data => {
				isFetching = false
				currentAnswerString = data[0].toUpperCase()
				currentAnswerArray = stringToArray(currentAnswerString)
				document.getElementById('word').innerHTML = ''
				currentWordArray = []
				for (i = 0; i < currentAnswerArray.length; i++) {
					currentWordArray[i] = '_'
				}
				document.getElementById('word').innerHTML = currentWordArray
				removeKeys()
				generateKeys()
			})
			.catch(err => {
				document.getElementById('word').innerHTML = 'Word not found, try another length'
			})
	}
}


function searchArray(array, valueToFind) {
	var i
	for (i = 0; i < array.length; i++) {
		if (array[i] == valueToFind) {
			console.log(i)
		}
	}
	return
}

function keyPressed(key) {
	if (!isFetching) {
		var button = document.getElementById(key)
		button.style.display = 'none'
		document.getElementById("guessDisplay").innerHTML = key

		for (i = 0; i < currentAnswerArray.length; i++) {
			if (currentAnswerArray[i] == key) {
				currentWordArray[i] = key
			}
		}
		document.getElementById('word').innerHTML = currentWordArray







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
		'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
		'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
		'Z', 'X', 'C', 'V', 'B', 'N', 'M'
	];
	const keysAlphabetical = [
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
	});
}

function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function showAnswer() {
	document.getElementById('word').innerHTML = currentAnswerArray
}