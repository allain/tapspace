Taaspace.util = (function () {
  //
  // Utility functions for example handling asynchronicity.
  // 
  var exports = {};
  /////////////////
  
  
  
  exports.mapReduce = function (array, mapfn, reducefn) {
    // Asynchronic map-reduce variant that can be used to
    // execute parallel async function calls and collect the results
    // after everything has finished.
    // 
    // See also
    //   https://en.wikipedia.org/wiki/MapReduce
    // 
    // Usage example
    //   mapReduce(
    //     [1, 0, 1],
    //     function map(x, done, index, array) {
    //       done(index, x + 1);
    //     },
    //     function reduce(resultArray) {
    //       // resultArray === [2, 1, 2]
    //     }
    //   });
    // 
    // Parameter
    //   array
    //     Keyword parameters. See Params.
    //   mapfn
    //     Function that maps array element to something that is passed
    //     to done function.
    //     function (x, done, index, array)
    //       x
    //         The element of array at index
    //       done
    //         Function to be called when mapping is calculated/done.
    //         function (index, value)
    //           index
    //             To which position the value should be stored in
    //             the resulting array.
    //           value
    //             The result of the map function. Is stored at index.
    //       index
    //          Index of the x in the given array.
    //       array
    //          The array given.
    //   reducefn
    //     Function to be executed when all mapfns are done.
    //     function (resultArray)
    //       resultArray
    //         Array of the mapped values.
    // 
    // Return
    //   undefined
    
    // Normalize and validate parameters
    var isKindOfArray = typeof array === 'object' &&
                        'length' in array;
    var validParams = typeof mapfn === 'function' &&
                      typeof reducefn === 'function' &&
                      isKindOfArray;
    if (!validParams) {
      throw {
        name: 'InvalidParameterError',
        message: 'Parameter \'array\' must be an array, ' +
                 '\'mapfn\' must be a function and ' +
                 '\'reducefn\' must be a function.'
      };
    }
    
    // If empty, result with new empty array.
    if (array.length === 0) {
      reducefn([]);
    }
    
    // Collect results here.
    var result = [];
    
    // A safety thing to prevent calling reducefn multiple times.
    var finished = false;
    
    // Wait for each done to accomplish.
    var numOfResults = 0;
    var requiredResults = array.length;
    
    var done = function (index, mappedElem) {
      result[index] = mappedElem;
      numOfResults += 1;
      
      if (numOfResults >= requiredResults) {
        if (!finished) {
          // Finish
          finished = true;
          reducefn(result);
        }
      }
    };
    
    var i, elem;
    for (i = 0; i < array.length; i += 1) {
      elem = array[i];
      mapfn(elem, done, i, array);
    }
    
  };
  
  
  exports.boxArea = function (box) {
    // Area of a box.
    // 
    // Return
    //   number
    //     Positive or 0;
    
    //                     area
    //                     w * h
    //               (width) * (height)
    return (box.x1 - box.x0) * (box.y1 - box.y0);
  };
  
  
  exports.intersectionArea = function (boxA, boxB) {
    // Calculate area of the intersection of two boxes.
    // 
    // Return
    //   number
    //     Positive number if boxes collide.
    //     0 if the boxes do not collide.
    var ItlX = Math.max(boxA.x0, boxB.x0);
    var ItlY = Math.max(boxA.y0, boxB.y0);
    var IbrX = Math.min(boxA.x1, boxB.x1);
    var IbrY = Math.min(boxA.y1, boxB.y1);
    var Iwidth;
    var Iheight;
    
    if (ItlX <= IbrX && ItlY <= IbrY) {
      Iwidth = IbrX - ItlX;
      Iheight = IbrY - ItlY;
      return Iwidth * Iheight;
    }
    
    // else
    return 0;
  };
  
  
  ///////////////
  return exports;
}());
