
/**
 * The servo motor used on the Wio Terminal rotates CCW. This means that it's degrees are inverted relative to
 * how we usually interpret degrees. Therefore we must transform the degrees into something that the servo motor can
 * accomplish. We do this by substracting 180 and getting the absolute value.
 * @param {*} degree 
 * @returns 
 */
export async function degreeToServoDegree(degree){
    return Math.abs(degree-180);
}
     /**
      * Processing the degrees by adding padding zeros.
      * For instance: If the input degree is 5, then it is formatted to be 005.
      * This ensures that the degree format respects the command structure.
      */
export async function padDeg(inputDeg){
    let paddingToAdd=3-inputDeg.toString().length;
    let processedDeg="";
    for(let i=0;i<paddingToAdd;i++){
      processedDeg+="0";
    }
    processedDeg+=inputDeg.toString()
    return processedDeg;
  }