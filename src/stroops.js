import {stripTrailingZeros} from './truncation.js'

/**
 * Convert value in stroops (Int64 amount) to the normal string representation
 * @param {String|Number|BigInt} valueInStroops
 * @return {String}
 */
export function fromStroops(valueInStroops) {
    try {
        let parsed = typeof valueInStroops === 'bigint' ?
            valueInStroops :
            BigInt(valueInStroops.toString().replace(/\.\d*/,''))
        let negative = false
        if (parsed < 0n) {
            negative = true
            parsed *= -1n
        }
        const int = parsed / 10000000n
        const fract = parsed % 10000000n
        let res = int.toString()
        if (fract) {
            res += '.' + fract.toString().padStart(7, '0')
        }
        if (negative) {
            res = '-' + res
        }
        return stripTrailingZeros(res)
    } catch (e) {
        return '0'
    }
}


/**
 * Convert arbitrary stringified amount to int64 representation
 * @param {String|Number} value
 * @return {BigInt}
 */
export function toStroops(value) {
    if (!value)
        return 0n
    if (typeof value === 'number') {
        value = value.toFixed(7)
    }
    if (typeof value !== 'string' || !/^-?[\d.,]+$/.test(value))
        return 0n //invalid format
    try {
        let [int, decimal = '0'] = value.split('.', 2)
        let negative = false
        if (int.startsWith('-')) {
            negative = true
            int = int.slice(1)
        }
        let res = BigInt(int) * 10000000n + BigInt(decimal.slice(0, 7).padEnd(7, '0'))
        if (negative) {
            res *= -1n
            if (res < -0x8000000000000000n) //overflow
                return 0n
        } else if (res > 0xFFFFFFFFFFFFFFFFn) //overflow
            return 0n
        return res
    } catch (e) {
        return 0n
    }
}