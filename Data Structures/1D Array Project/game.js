var testString = "WhyHelloThere"
var currentWordArray = []
var currentWordString = ""
var isFetching = false
function go() {

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


const fetchRandomWord = function (length) {
	if (!isFetching) {
		isFetching = true
		document.getElementById("answer").innerHTML = "Fetching word, please wait"
		fetch("https://random-word-api.herokuapp.com/word?length=" + length)
			.then(res => res.json())
			.then(data => {
				isFetching = false
				currentWordString = data[0].toUpperCase()
				currentWordArray = stringToArray(currentWordString)
				document.getElementById("answer").innerHTML = "Answer: " + currentWordString
			})
			.catch(err => {
				alert("Word Not Found!")
			})
	}
	//showBtn.innerText = `Please wait. Fetching the word ...`

}

function displayArray(array, elementId) {
	document.getElementById(elementId).innerHTML = ""
	for (i = 0; i < array.length; i++) {
		document.getElementById(elementId).innerHTML += array[i]
	}
}