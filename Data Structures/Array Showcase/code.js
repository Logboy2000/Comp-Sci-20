var names = ["Thomas the train", "Jeremey", "Mike", "Joe Biden", "Mr. Clean"]
var numbers = [10, 20, 40, 80]
var numbers2 = []

function go() {
    displayArray(names, "output")
    displayArray(numbers, "numbersOutput")
}

function displayArray(array, elementId) {
    for (i = 0; i < array.length; i++) {
        document.getElementById(elementId).innerHTML += array[i] + "<br/> "
    }
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
function searchArrayButton() {
    alert("The value is at index " + searchArray(names, document.getElementById("arraySearchInput").value))
}


function copyArray(copiedArray, pasteArray) {
    var i
    for (i = 0; i < copiedArray.length; i++) {
        pasteArray[i] = copiedArray[i]
    }
}
function copyArrayButton() {
    copyArray(numbers, numbers2)
    displayArray(numbers2, "numbers2Output")
}

function insertIntoArray(array, insertionIndex, value) {
    var i
    for(i = insertionIndex;){
        
    }
}