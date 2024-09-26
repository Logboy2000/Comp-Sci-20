// Without help
function insertIntoArray(insertionIndex, value, array) {
    for(i = array.length; i > insertionIndex; i--){
        array[i] = array[i-1]
    }
    array[insertionIndex] = value
    return array
}


// With help
function insertArray(value, insertionIndex, array) {
    for (i = array.length; i > insertionIndex; i--) {
        array[i] = array[i - 1]
    }
    array[insertionIndex] = value
    return array
}