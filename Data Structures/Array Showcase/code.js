var names = ["Thomas the train", "Jeremey", "Mike", "Joe Biden", "Mr. Clean"]
var numbers = [10, 20, 40, 80]
var numbers2 = []

function go() {
    displayArray(names, "output")
    displayArray(numbers, "numbersOutput")
    displayArray(array1, "array1Display")
    displayArray(array2, "array2Display")
}

function displayArray(array, elementId) {
    document.getElementById(elementId).innerHTML = ""
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


function copyArray(copiedArray) {
    var outputArray = []
    var i
    for (i = 0; i < copiedArray.length; i++) {
        outputArray[i] = copiedArray[i]
    }
    return outputArray
}
function copyArrayButton() {
    numbers2 = copyArray(numbers)
    document.getElementById("numbers2Output").innerHTML = ""
    displayArray(numbers2, "numbers2Output")
}

var arrayThatGetsInsertedInto = [1, 2, 5]

function insertIntoArray(value, insertionIndex, inputArray) {
    var outputArray = inputArray
    var i
    for (i = insertionIndex; i < inputArray.length - 1; i++) {
        outputArray[i + 1] = outputArray[i]
    }

    outputArray[insertionIndex] = value
    return outputArray
}
function insertIntoArrayButton() {
    arrayThatGetsInsertedInto = insertIntoArray(document.getElementById("arrayInsertionInputValue").value, document.getElementById("arrayInsertionInputIndex").value, arrayThatGetsInsertedInto)
    displayArray(arrayThatGetsInsertedInto, "arrayThatGetsInsertedIntoOutput")
}





function mergeArrays(array1, array2) {
    var outputArray = copyArray(array1)
    var i
    for (i = 0; i < array2.length; i++) {
        outputArray[i + array1.length] = array2[i]
    }
    return outputArray
}


var array1 = [5, 2, 7]
var array2 = ["y", "x", "z"]
function mergeArraysButton(){

    var mergedArray = mergeArrays(array1, array2)
    displayArray(mergedArray, "mergedArrayDisplay")
}