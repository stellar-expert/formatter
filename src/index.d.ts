/**
 * Check if a provided value can be safely used as token amount in Stellar operations
 * @param value
 * @param denominate
 * @param nonZero
 */
export function isValidInt64Amount(value: string, denominate?: boolean, nonZero?: boolean): boolean

/**
 * Format a number with specified precision and decimals separator
 * @param value - Numeric value to format
 * @param precision - Desired precision (7 digits by default)
 * @param separator - Decimals separator
 */
export function formatWithPrecision(value: string | number | bigint, precision?: number, separator?: string): string

/**
 * Format a number using automatically determined precision
 * @param value - Numeric value to format
 * @param separator - Decimals separator
 */
export function formatWithAutoPrecision(value: string | number, separator?: string): string

/**
 * Convert a number to a human-readable format using abbreviation
 * @param value - Value to format
 * @param decimals - Precision of the abbreviated string to retain
 */
export function formatWithAbbreviation(value: number, decimals?: number): string

/**
 * Format a number with rounding to specific precision group
 * @param value - Value to format
 * @param group - Logarithmic group rate for rounding
 */
export function formatWithGrouping(value: string | number | bigint, group: number): string

/**
 * Format a number as price with specified significant digits precision
 * @param value - Value to format
 * @param significantDigits - Significant digits for automatic formatting
 */
export function formatPrice(value: string | number | bigint, significantDigits?: number): string

/**
 * Format amount according to default Stellar precision
 * @param amount - Value to format
 */
export function adjustPrecision(amount?: number | string): string

/**
 * Convert rational price representation to Number
 * @param price
 */
export function approximatePrice(price: {n: number, d: number} | number | string): number

/**
 * Convert any timestamp representation to a valid date format
 * @param date - Date to parse
 * @param autoUnixFormatDetection - Intelligent guess for dates already represented as UNIX timestamp (true by default)
 * @return Parsed date
 */
export function normalizeDate(date: Date | string | number, autoUnixFormatDetection?: boolean): Date

/**
 * Convert date to a numeric UNIX timestamp representation
 * @param date - Date to convert
 * @return UNIX timestamp
 */
export function toUnixTimestamp(date: Date | string | number): number

/**
 * Convert date to ISO-like human-readable format
 * @param date - Date to convert
 */
export function formatDateUTC(date: Date | string | number): string

/**
 * Remove trailing zero symbols from a formatted numeric string
 * @param value
 */
export function stripTrailingZeros(value: string): string

/**
 * Truncate strings longer than N symbols replacing characters in the middle with ellipsis
 * @param value - Original string
 * @param symbols - Maximum string length
 */
export function shortenString(value: string, symbols?: number): string

/**
 * Convert value in stroops (raw amount) to the normal string representation
 * @param valueInStroops
 * @param decimals
 */
export function fromStroops(valueInStroops: string | number | bigint, decimals?: number): string

/**
 * Convert arbitrary stringified amount to raw representation
 * @param value
 * @param decimals
 */
export function toStroops(value: string | number, decimals?: number): bigint
