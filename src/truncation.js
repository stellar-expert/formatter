/**
 * Remove trailing zero symbols from a formatted numeric string
 * @param {String} value
 * @return {String}
 */
export function stripTrailingZeros(value) {
    if (typeof value !== 'string') return value
    let [int, reminder] = value.split('.')
    if (!reminder) return int
    reminder = reminder.replace(/0+$/, '')
    if (!reminder.length) return int
    return int + '.' + reminder
}

/**
 * Truncate strings longer than N symbols replacing characters in the middle with ellipsis
 * @param {String} value - Original string
 * @param {Number} [symbols] - Maximum string length
 * @return {String}
 */
export function shortenString(value, symbols = 8) {
    if (value.length <= symbols) return value
    const affixLength = Math.max(2, Math.floor(symbols / 2))
    return value.substr(0, affixLength) + '…' + value.substr(-affixLength)
}