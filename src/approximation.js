/**
 * Convert rational price representation to Number
 * @param {{n: Number, d: Number}|Number|String} price
 * @return {Number}
 */
export function approximatePrice(price) {
    if (!price)
        return 0
    if (price.n)
        return price.n / price.d
    if (typeof price === 'string')
        return parseFloat(price)
    return price
}