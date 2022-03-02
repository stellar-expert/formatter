import Bignumber from 'bignumber.js'
import {stripTrailingZeros} from './truncation'

function addDecimalsSeparators(value, separator = ',', trimTrailingZeros = true) {
    //TODO: use Bignumber.toFormat() method instead
    //split numeric to parts
    let [int, reminder] = value.split('.'),
        res = ''
    //split digit groups
    while (int.length > 3) {
        res = separator + int.substr(-3) + res
        int = int.substr(0, int.length - 3)
    }
    //strip negative sign
    if (int === '-') {
        res = res.substr(1)
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

function safeParseBignumber(value) {
    if (!value) return new Bignumber(0)
    if (typeof value === 'number') {
        value = value.toFixed(7)
    }
    if (typeof value === 'string') {
        value = new Bignumber(value)
        if (value.isNaN()) return '0'
    }
    if (value instanceof Bignumber) return value
    throw new TypeError(`Unsupported BigNumber value type: ${typeof value}`)
}

/**
 * Format a number with specified precision and decimals separator
 * @param {String|Number|Bignumber} value - Numeric value to format
 * @param {Number} [precision] - Desired precision (7 digits by default)
 * @param {String} [separator] - Decimals separator
 * @return {String}
 */
export function formatWithPrecision(value, precision = 7, separator = ',') {
    //use 7 decimals if not specified
    if (!(precision >= 0) || precision > 7) {
        precision = 7
    }
    return addDecimalsSeparators(safeParseBignumber(value).toFixed(precision), separator, true)
}

/**
 * Format a number using automatically determined precision and decimals separator
 * @param {String|Number|Bignumber} value - Numeric value to format
 * @param {String} [separator] - Decimals separator
 * @return {String}
 */
export function formatWithAutoPrecision(value, separator = ',') {
    if (!value) return '0'
    if (typeof value === 'number') {
        value = value.toFixed(14)
    }
    if (typeof value === 'string') {
        value = new Bignumber(value)
    }
    let p = Math.ceil(Math.log10(value.toNumber())),
        reminderPrecision = p > 1 ? (3 - p) : (Math.abs(p) + 2)
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
    let abs = Math.abs(value),
        tier = Math.log10(abs) / 3 | 0

    if (tier <= 0) return formatWithAutoPrecision(value)

    const suffix = ['', 'K', 'M', 'G', 'T', 'P'][tier]
    abs = stripTrailingZeros((abs / Math.pow(10, tier * 3)).toFixed(decimals))
    return `${value < 0 ? '-' : ''}${abs || '0'}${suffix}`
}

/**
 * Format a number with rounding to specific precision group
 * @param {String|Number|Bignumber} value - Value o format
 * @param {Number} group - Logarithmic group rate for rounding
 * @return {String}
 */
export function formatWithGrouping(value, group) {
    if (!value) return '0'
    let precision = group >= 1 ? 0 : Math.abs(Math.log10(group))
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
    const [int] = safeParseBignumber(value).toString()
    if (int !== '0') {
        significantDigits -= int.length
    }
    const res = formatWithPrecision(value, significantDigits, '')
    return stripTrailingZeros(res)
}

/**
 * Format amount according to default Stellar precision
 * @param {Number|String|Bignumber} amount - Value to format
 * @return {String}
 */
export function adjustPrecision(amount = '0') {
    if (typeof amount === 'number') {
        amount = amount.toFixed(7)
    } else {
        amount = new Bignumber(amount.toString()).toFixed(7)
    }
    return stripTrailingZeros(amount)
}