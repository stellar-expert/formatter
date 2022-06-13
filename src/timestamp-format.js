/**
 * Convert any timestamp representation to a valid date format
 * @param {Date|String|Number} date - Date to parse
 * @param {Boolean} [autoUnixFormatDetection] - Intelligent guess for dates already represented as UNIX timestamp (true by default)
 * @return {Date} Parsed date
 */
export function normalizeDate(date, autoUnixFormatDetection = true) {
    //try parse string representation
    if (typeof date === 'string') {
        if (!/^\d+$/.test(date)) {
            if (!date.endsWith('Z')) {
                date += 'Z'
            }
            date = new Date(date)
        } else {
            date = parseInt(date)
        }
    }
    //parse numeric representation
    if (typeof date === 'number') {
        //input resembles a UNIX timestamp
        if (date < 2147483648 && autoUnixFormatDetection) {
            date *= 1000
        }
        date = new Date(date)
    }
    //check validity
    if (!(date instanceof Date) || isNaN(date.valueOf()))
        throw new Error('Invalid timestamp ' + date)
    return date
}

/**
 * Convert date to a numeric UNIX timestamp representation
 * @param {Date|String|Number} date - Date to convert
 * @return {Number} UNIX timestamp
 */
export function toUnixTimestamp(date) {
    return Math.floor(normalizeDate(date).getTime() / 1000)
}

/**
 * Convert date to ISO-like human-readable format
 * @param {Date|String|Number} date - Date to convert
 * @return {String}
 */
export function formatDateUTC(date) {
    return normalizeDate(date)
        .toISOString()
        .replace(/(T|\.\d+Z)/g, ' ') // make it more human friendly
        .trim()
}