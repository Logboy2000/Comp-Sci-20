var nums = new Array()
nums.length = 2
for (i = 0; i < nums.length; i++) {
    nums[i] = new Array()
}

nums[0][0] = 3
nums[0][1] = 4
nums[0][2] = 8
nums[1][0] = 12
nums[1][1] = 25
nums[1][2] = 90

var x
var y



for (x = 0; x < nums.length; x++) {
    for(y = 0; y < nums[0].length; y++){
        alert(nums[x][y])
    }
}



