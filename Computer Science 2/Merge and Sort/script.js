var array1 = []
var array2 = []
var arrayMerged = []

//Start of loaded function
function loaded() {
    array1 = createRandomArray(424)
    array2 = createRandomArray(53)
    displayArray(array1, "array1")
    displayArray(array2, "array2")
}
//End of loaded function


//Start of mergeAndSort function
/**
 * Assumes the two arrays are already sorted
 */
function mergeAndSort(arrayA, arrayB) {
    var outputArray = []
    var arrayAIndex = 0
    var arrayBIndex = 0
    var outputArrayIndex = 0
    while (arrayAIndex < arrayA.length && arrayBIndex < arrayB.length) {
        if (arrayA[arrayAIndex] < arrayB[arrayBIndex]) {// arrayA's value is lower
            outputArray[outputArrayIndex] = arrayA[arrayAIndex]
            arrayAIndex++
            outputArrayIndex++
        } else {//arrayB's value is lower
            outputArray[outputArrayIndex] = arrayB[arrayBIndex]
            arrayBIndex++
            outputArrayIndex++
        }
    }
    while (arrayAIndex < arrayA.length){
        outputArray[outputArrayIndex] = arrayA[arrayAIndex]
        arrayAIndex++
        outputArrayIndex++
    }
    while (arrayBIndex < arrayB.length){
        outputArray[outputArrayIndex] = arrayB[arrayBIndex]
        arrayBIndex++
        outputArrayIndex++
    }

    console.log(outputArray)
    return outputArray
}
//End of mergeAndSort function

//Start of button function
function button() {
    arrayMerged = mergeAndSort(array1, array2)
    displayArray(array1, "array1")
    displayArray(array2, "array2")
    displayArray(arrayMerged, "arrayMerged")
}
//End of button function

//Start of displayArray function
function displayArray(array, elementID) {
    document.getElementById(elementID).innerHTML = array.join(", ")
}
//End of displayArray function

//Start of randomFromInterval
function randomFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//End of randomFromInterval

//Start of createRandomArray
function createRandomArray(arrayLength) {
    var lowest = 0
    var newArray = []
    for (i = 0; i < arrayLength; i++) {
        newArray[i] = randomFromInterval(lowest + 1, (i + 1) * 10)
        lowest = newArray[i]
    }
    return newArray
}
//End of createRandomArray