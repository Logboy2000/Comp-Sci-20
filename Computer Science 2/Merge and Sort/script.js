var array1 = [1, 60, 5, 7, 9,-10]
var array2 = [2, 4, 11, 6, 8, 10]
var arrayMerged = []

//Start of loaded function
function loaded(){
    displayArray(array1, "array1")
    displayArray(array2, "array2")
}
//End of loaded function


//Start of mergeAndSort function
function mergeAndSort(array1, array2) {
    // Merge arrays
    var outputArray = []
    outputArray = array1.concat(array2)
    
    // Bubble sort
    for(var i = 0; i < outputArray.length; i++) {
        for(var j = 0; j < outputArray.length - 1; j++) {
            if(outputArray[j] > outputArray[j + 1]) {
                var tempArray = outputArray[j]
                outputArray[j] = outputArray[j + 1]
                outputArray[j + 1] = tempArray
            }
        }
    }
    
    console.log(outputArray)
    return outputArray
}
//End of mergeAndSort function

//Start of button function
function button(){
    arrayMerged = mergeAndSort(array1, array2)
    displayArray(arrayMerged, "arrayMerged")
}
//End of button function

//Start of displayArray function
function displayArray(array, elementID){
    document.getElementById(elementID).innerHTML = array.join(", ")
}
//End of displayArray function