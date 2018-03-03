var utils = {
    arrAverage(arr) {
        var sum = arr.reduce(function(a, b) { return a + b; });
        return sum / arr.length;
    },
      map( num, min1, max1, min2, max2 ) {
    var num1 = ( num - min1 ) / ( max1 - min1 )
    var num2 = ( num1 * ( max2 - min2 ) ) + min2
    return num2;
    },
    displacement(nb, departure, arrival, ratio) {
        for(var i=0; i< nb; i++){
            arrival[i].x += (departure[i].x - arrival[i].x) * ratio
            arrival[i].y += (departure[i].y - arrival[i].y) * ratio
            arrival[i].z += (departure[i].z - arrival[i].z) * ratio
        }

    }
}
export default utils;
