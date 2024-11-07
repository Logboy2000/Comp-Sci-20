var array1 = [1, 60, 5, 7, 9,-10]
var array2 = [2, 4, 11, 6, 8, 10]
var arrayMerged = []

function mergeAndSort(array1, array2) {
    // Merge arrays
    var outputArray = []
    outputArray = array1.concat(array2)
    
    // Bubble sort
    for(var i = 0; i < outputArray.length; i++) {
        for(var j = 0; j < outputArray.length - 1; j++) {
            if(outputArray[j] > outputArray[j + 1]) {
                var temp = outputArray[j]
                outputArray[j] = outputArray[j + 1]
                outputArray[j + 1] = temp
            }
        }
    }
    
    console.log(outputArray)
    return outputArray
}
function button(){
    mergeAndSort(array1, array2)
}