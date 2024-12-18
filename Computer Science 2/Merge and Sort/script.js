var array1 = []
var array2 = []
var arrayMerged = []

//Start of loaded function
/**
 * Initializes the arrays with random values and displays them.
 * Inputs: None
 * Outputs: Displays array1 and array2 in the respective HTML elements.
 */
function loaded() {
    array1 = createRandomArray(424)
    array2 = createRandomArray(53)
    displayArray(array1, "array1")
    displayArray(array2, "array2")
}
//End of loaded function



/**
 * Start of mergeAndSort function
 * Assumes the two arrays are already sorted
 * Inputs: arrayA (sorted array), arrayB (sorted array)
 * Outputs: Merged and sorted array containing elements from both input arrays.
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
/**
 * Merges the two arrays and displays them.
 * Inputs: None
 * Outputs: Displays array1, array2, and the merged array in the respective HTML elements.
 */
function button() {
    arrayMerged = mergeAndSort(array1, array2)
    displayArray(array1, "array1")
    displayArray(array2, "array2")
    displayArray(arrayMerged, "arrayMerged")
}
//End of button function

//Start of displayArray function
/**
 * Displays the contents of an array in a specified HTML element.
 * Inputs: array (array to display), elementID (ID of the HTML element)
 * Outputs: Updates the innerHTML of the specified element with the array contents.
 */
function displayArray(array, elementID) {
    document.getElementById(elementID).innerHTML = array.join(", ")
}
//End of displayArray function

//Start of randomFromInterval
/**
 * Generates a random integer between the specified minimum and maximum values.
 * Inputs: min (minimum value), max (maximum value)
 * Outputs: A random integer between min and max, inclusive.
 */
function randomFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//End of randomFromInterval

//Start of createRandomArray
/**
 * Creates an array of random integers of specified length.
 * Inputs: arrayLength (length of the array to create)
 * Outputs: An array filled with random integers.
 */
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