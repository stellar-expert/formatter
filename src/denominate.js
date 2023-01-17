import Bignumber from 'bignumber.js'

/**
 * Convert value in stroops (Int64 amount) to the normal string representation
 * @param {String|Number} valueInStroops
 * @return {String}
 */
export function denominate(valueInStroops) {
    if (valueInStroops instanceof Array)
        throw new Error('Invalid value to denominate')
    return new Bignumber(valueInStroops).div(10000000).toFixed(7).replace(/0+$/, '')
}
