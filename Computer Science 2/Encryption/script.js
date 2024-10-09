var alphabet = []
for (let i = 0; i < 26; i++) {
    alphabet.push(String.fromCharCode(65 + i)) // 65 is the ASCII code for 'A'
}

var cipher1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'L', 'K', 'J', 'H', 'G', 'F', 'D', 'S', 'A', 'Z', 'X', 'C', 'V', 'B', 'N', 'M']

function encryptString(string, cipher) { //Encrypts a string using a polyalphabetic cipher
    string = string.toUpperCase()
    for (var i = 0; i < string.length; i++) {

        string = string.replaceAt(i, cipher[searchArray(alphabet, string[i])])
    }
    return string
}
function decryptString(string) {
    string = string.toUpperCase()




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