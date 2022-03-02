import Bignumber from 'bignumber.js'

/**
 * Approximate the rational number and convert it to the standards Stellar n/d format
 * @param {String|Number|Bignumber} src - Number to approximate
 * @param {Number} [maxIterations] - Maximum price finding algorithm iterations
 * @returns {{n: Number, d: Number}}
 */
export function findFractionalApproximation(src, maxIterations = 50) {
    let real = new Bignumber(src),
        int,
        fract,
        i = 2,
        fractions = [[new Bignumber(0), new Bignumber(1)], [new Bignumber(1), new Bignumber(0)]]

    while (true) {
        if (real.gt(2147483647))
            break
        int = real.floor()
        fract = real.sub(int)
        const fractionN = int.mul(fractions[i - 1][0]).add(fractions[i - 2][0]),
            fractionD = int.mul(fractions[i - 1][1]).add(fractions[i - 2][1])
        if (fractionN.gt(2147483647) || fractionD.gt(2147483647))
            break
        fractions.push([fractionN, fractionD])
        if (fract.eq(0))
            break
        real = new Bignumber(1).div(fract)
        i += 1
    }
    const [n, d] = fractions[fractions.length - 1]

    if (n.isZero() || d.isZero())
        throw new Error('Failed to find approximation')

    return {n, d}
}


/**
 * Convert rational price representation to Number
 * @param {{n: Number, d: Number}} price
 * @return {Number}
 */
export function approximatePrice(price) {
    return price.n / price.d
}