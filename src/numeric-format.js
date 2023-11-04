import {stripTrailingZeros} from './truncation.js'
import {toStroops} from './stroops.js'

function addDecimalsSeparators(value, separator = ',', trimTrailingZeros = true) {
    //TODO: use Bignumber.toFormat() method instead
    //split numeric to parts
    let [int, reminder] = value.split('.')
    let res = ''
    //split digit groups
    while (int.length > 3) {
        res = separator + int.substring(int.length - 3) + res
        int = int.substring(0, int.length - 3)
    }
    //strip negative sign
    if (int === '-') {
        res = res.substring(1)
    }
    res = int + res
    if (reminder) {
        res += '.' + reminder
    }
    if (trimTrailingZeros) {
        res = stripTrailingZeros(res)
    }
    return res
}

/**
 * Check if a provided value can be safely used as token amount in Stellar operations
 * @param {String} value
 * @param {Boolean} denominate
 * @param {Boolean} nonZero
 * @return {Boolean}
 */
export function isValidInt64Amount(value, denominate = true, nonZero = false) {
    try {
        const parsed = denominate ?
            toStroops(value) :
            BigInt(value)
        if (nonZero) {
            if (parsed <= 0n)
                return false
        } else {
            if (parsed < 0n)
                return false
        }
        return parsed <= 9223372036854775807n
    } catch (e) {
        return false
    }
}

/**
 * Format a number with specified precision and decimals separator
 * @param {String|Number|BigInt} value - Numeric value to format
 * @param {Number} [precision] - Desired precision (7 digits by default)
 * @param {String} [separator] - Decimals separator
 * @return {String}
 */
export function formatWithPrecision(value, precision = 7, separator = ',') {
    return addDecimalsSeparators(setPrecision(value, precision), separator, true)
}

/**
 * Format a number using automatically determined precision
 * @param {String|Number} value - Numeric value to format
 * @param {String} [separator] - Decimals separator
 * @return {String}
 */
export function formatWithAutoPrecision(value, separator = ',') {
    if (!value)
        return '0'
    const p = Math.ceil(Math.log10(parseFloat(value)))
    let reminderPrecision = p > 1 ?
        (3 - p) :
        (Math.abs(p) + 2)
    if (reminderPrecision < 0) {
        reminderPrecision = 0
    }
    return formatWithPrecision(value, reminderPrecision, separator)
}

/**
 * Convert a number to a human-readable format using abbreviation
 * @param {Number} value - Value to format
 * @param {Number} [decimals] - Precision of the abbreviated string to retain
 * @return {String}
 */
export function formatWithAbbreviation(value, decimals = 2) {
    let abs = Math.abs(value)
    const tier = Math.log10(abs) / 3 | 0

    if (tier <= 0)
        return formatWithAutoPrecision(value)

    const suffix = ['', 'K', 'M', 'G', 'T', 'P'][tier]
    abs = stripTrailingZeros((abs / Math.pow(10, tier * 3)).toFixed(decimals))
    return `${value < 0 ? '-' : ''}${abs || '0'}${suffix}`
}

/**
 * Format a number with rounding to specific precision group
 * @param {String|Number|BigInt} value - Value to format
 * @param {Number} group - Logarithmic group rate for rounding
 * @return {String}
 */
export function formatWithGrouping(value, group) {
    if (!value)
        return '0'
    const precision = (group >= 1 || group === 0) ?
        0 :
        Math.abs(Math.log10(group))
    if (group >= 1) {
        value = Math.ceil(value / group) * group
    }
    return formatWithPrecision(value, precision)
}

/**
 * Format a number as price with specified significant digits precision
 * @param {String|Number|Bignumber} value - Value to format
 * @param {Number} significantDigits - Significant digits for automatic formatting
 * @return {String}
 */
export function formatPrice(value, significantDigits = 4) {
    const primitive = (typeof value === 'number') ?
        value.toFixed(7) :
        value.toString()
    const [int, fract] = primitive.split('.')
    if (int.replace('-', '') !== '0') {
        significantDigits -= int.length
        if (significantDigits < 0) {
            significantDigits = 0
        }
    } else {
        if (!(fract > 0))
            return '0'
        significantDigits = Math.max(Math.ceil(Math.abs(Math.log10(parseFloat('.' + fract)))), significantDigits)
    }
    return formatWithPrecision(value, significantDigits, '')
}

/**
 * Format amount according to default Stellar precision
 * @param {Number|String} amount - Value to format
 * @return {String}
 */
export function adjustPrecision(amount = '0') {
    return stripTrailingZeros(setPrecision(amount, 7))
}

function setPrecision(amount, precision) {
    if (typeof amount === 'number') {
        amount = amount.toFixed(precision)
    } else {
        amount = amount.toString()
        const sidx = amount.indexOf('.')
        if (sidx >= 0) {
            amount = amount.slice(0, sidx + precision + 1)
        }
    }
    return amount
}