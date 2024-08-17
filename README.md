# @stellar-expert/formatter

## Installation

```
npm i @stellar-expert/formatter
```

## Usage

### Stroops representation

`fromStroops(valueInStroops)` - Convert value in stroops (Int64 amount) to the normal string representation

`toStroops(value)` - Convert arbitrary stringified amount to Int64 representation

### Number formatting

`formatWithPrecision(value, precision = 7, separator = ',')` - Format a number with specified precision and decimals separator

`formatWithAutoPrecision(value, separator = ',')` - Format a number using automatically determined precision and decimals separator

`formatWithAbbreviation(value, decimals = 2)` - Convert a number to a human-readable format using abbreviation

`formatWithGrouping(value, group)` - Format a number with rounding to specific precision group

`formatPrice(value, significantDigits = 4)` - Format a number as price with specified significant digits precision

`adjustPrecision(amount)` - Format amount according to default Stellar precision

`approximatePrice(price)` - Convert rational price representation to float-point number

`isValidInt64Amount(value, denominate = true, nonZero = false)` - Check if a provided value can be safely used as token amount in Stellar
operations

### String truncation

`shortenString(value, symbols = 8)` - Truncate strings longer than N symbols replacing characters in the middle with ellipsis

`stripTrailingZeros(value)` - Remove trailing zero symbols from a formatted numeric string

### Date formatting

`normalizeDate(date, autoUnixFormatDetection = true)` - Convert any timestamp representation to a valid date format

`toUnixTimestamp(date)` - Convert date to a numeric UNIX timestamp representation

`formatDateUTC(date)` - Convert date to ISO-like human-readable format

## Testing

Run `jest` with `--experimental-vm-modules` NodeJS flag.