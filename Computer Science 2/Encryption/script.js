var characterList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@', '#']
var cipher1 = ['Q', 'W', '3', 'M', '7', ' ', 'L', 'P', 'X', 'N', 'B', 'V', 'C', 'Z', 'A', '#', 'H', 'Y', '@', 'E', '2', '!', 'D', 'I', 'K', 'R', 'T', '4', 'U', '8', '1', '5', 'O', 'J', 'S', '0', 'G', 'F', '6', '9']


var encodeInput
var decodeInput
var encodeOutput
var decodeOutput


function loaded() {
    encodeOutput = document.getElementById("encodeOut")
    decodeOutput = document.getElementById("decodeOut")
    encodeInput = document.getElementById("encodeIn")
    decodeInput = document.getElementById("decodeIn")
    document.getElementById("supportedChars").innerText = characterList
    document.getElementById("cipherChars").innerText = cipher1
}


function encryptString(string, cipher) { //Encrypts a string using a polyalphabetic cipher
    string = string.toUpperCase()
    for (var i = 0; i < string.length; i++) {
        string = string.replaceAt(i, cipher[searchArray(characterList, string[i])])
    }
    return string
}
function decryptString(string, cipher) {
    string = string.toUpperCase()
    for (var i = 0; i < string.length; i++) {
        string = string.replaceAt(i, characterList[searchArray(cipher, string[i])])
    }
    return string
}
function searchArray(array, valueToFind) {
    var i
    for (i = 0; i < array.length; i++) {
        if (array[i] == valueToFind) {
            return i
        }
    }
    return -1
}

String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function encodeButton() {
    var outputString = encryptString(encodeInput.value, cipher1)
    encodeOutput.innerHTML = outputString
}
function decodeButton() {
    var outputString = decryptString(decodeInput.value, cipher1)
    decodeOutput.innerHTML = outputString
}