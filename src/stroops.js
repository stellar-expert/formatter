import {stripTrailingZeros} from './truncation.js'

/**
 * Convert value in stroops (raw amount) to the normal string representation
 * @param {String|Number|BigInt} valueInStroops
 * @param {Number} [decimals]
 * @return {String}
 */
export function fromStroops(valueInStroops, decimals = 7) {
    try {
        decimals = normalizeDecimals(decimals)
        let parsed = typeof valueInStroops === 'bigint' ?
            valueInStroops :
            BigInt(valueInStroops.toString().replace(/\.\d*/, ''))
        let negative = false
        if (parsed < 0n) {
            negative = true
            parsed *= -1n
        }
        const divider = 10n ** BigInt(decimals)
        const int = parsed / divider
        const fract = parsed % divider
        let res = int.toString()
        if (fract) {
            res += '.' + fract.toString().padStart(decimals, '0')
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
 * Convert arbitrary stringified amount to raw representation
 * @param {String|Number} value
 * @param {Number} [decimals]
 * @return {BigInt}
 */
export function toStroops(value, decimals = 7) {
    if (!value)
        return 0n
    if (typeof value === 'number') {
        value = value.toFixed(7)
    }
    if (typeof value !== 'string' || !/^-?[\d.,]+$/.test(value))
        return 0n //invalid format
    try {
        decimals = normalizeDecimals(decimals)
        let [int, decimal = '0'] = value.split('.', 2)
        let negative = false
        if (int.startsWith('-')) {
            negative = true
            int = int.slice(1)
        }

        const divider = 10n ** BigInt(decimals)
        let res = BigInt(int) * divider + BigInt(decimal.slice(0, decimals).padEnd(decimals, '0'))
        if (negative) {
            res *= -1n
            if (res < -0x80000000000000000000000000000000n) //overflow
                return 0n
        } else if (res > 0x80000000000000000000000000000000n) //overflow
            return 0n
        return res
    } catch (e) {
        return 0n
    }
}

function normalizeDecimals(decimals) {
    if (decimals === undefined)
        return 7
    if (typeof decimals !== 'number') {
        decimals = parseInt(decimals.toString(), 0)
    }
    if (decimals < 0)
        return 0
    if (decimals > 38)
        return 38
    return decimals
}