import {
    adjustPrecision,
    formatWithAutoPrecision,
    formatWithAbbreviation,
    formatWithGrouping,
    formatWithPrecision,
    formatPrice,
    isValidInt64Amount
} from './numeric-format.js'
import {formatDateUTC, normalizeDate, toUnixTimestamp} from './timestamp-format.js'
import {approximatePrice} from './approximation.js'
import {shortenString, stripTrailingZeros} from './truncation.js'
import {toStroops, fromStroops} from './stroops.js'

const formatter = {
    adjustPrecision,
    formatWithAutoPrecision,
    formatWithAbbreviation,
    formatWithGrouping,
    formatWithPrecision,
    formatPrice,
    isValidInt64Amount,
    formatDateUTC,
    normalizeDate,
    toUnixTimestamp,
    approximatePrice,
    shortenString,
    stripTrailingZeros,
    toStroops,
    fromStroops
}

export default formatter