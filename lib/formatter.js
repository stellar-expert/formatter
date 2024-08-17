(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["formatter"] = factory();
	else
		root["formatter"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ commonjs)
});

;// CONCATENATED MODULE: ./src/truncation.js
/**
 * Remove trailing zero symbols from a formatted numeric string
 * @param {String} value
 * @return {String}
 */
function stripTrailingZeros(value) {
  if (typeof value !== 'string') return value;
  let [int, reminder] = value.split('.');
  if (!reminder) return int;
  reminder = reminder.replace(/0+$/, '');
  if (!reminder.length) return int;
  return int + '.' + reminder;
}

/**
 * Truncate strings longer than N symbols replacing characters in the middle with ellipsis
 * @param {String} value - Original string
 * @param {Number} [symbols] - Maximum string length
 * @return {String}
 */
function shortenString(value, symbols = 8) {
  if (!value || value.length <= symbols) return value;
  const affixLength = Math.max(2, Math.floor(symbols / 2));
  return value.substring(0, affixLength) + '…' + value.substring(value.length - affixLength);
}
;// CONCATENATED MODULE: ./src/stroops.js


/**
 * Convert value in stroops (Int64 amount) to the normal string representation
 * @param {String|Number|BigInt} valueInStroops
 * @return {String}
 */
function fromStroops(valueInStroops) {
  try {
    let parsed = typeof valueInStroops === 'bigint' ? valueInStroops : BigInt(valueInStroops.toString().replace(/\.\d*/, ''));
    let negative = false;
    if (parsed < 0n) {
      negative = true;
      parsed *= -1n;
    }
    const int = parsed / 10000000n;
    const fract = parsed % 10000000n;
    let res = int.toString();
    if (fract) {
      res += '.' + fract.toString().padStart(7, '0');
    }
    if (negative) {
      res = '-' + res;
    }
    return stripTrailingZeros(res);
  } catch (e) {
    return '0';
  }
}

/**
 * Convert arbitrary stringified amount to int64 representation
 * @param {String|Number} value
 * @return {BigInt}
 */
function toStroops(value) {
  if (!value) return 0n;
  if (typeof value === 'number') {
    value = value.toFixed(7);
  }
  if (typeof value !== 'string' || !/^-?[\d.,]+$/.test(value)) return 0n; //invalid format
  try {
    let [int, decimal = '0'] = value.split('.', 2);
    let negative = false;
    if (int.startsWith('-')) {
      negative = true;
      int = int.slice(1);
    }
    let res = BigInt(int) * 10000000n + BigInt(decimal.slice(0, 7).padEnd(7, '0'));
    if (negative) {
      res *= -1n;
      if (res < -0x8000000000000000n)
        //overflow
        return 0n;
    } else if (res > 0xFFFFFFFFFFFFFFFFn)
      //overflow
      return 0n;
    return res;
  } catch (e) {
    return 0n;
  }
}
;// CONCATENATED MODULE: ./src/numeric-format.js


function addDecimalsSeparators(value, separator = ',', trimTrailingZeros = true) {
  //TODO: use Bignumber.toFormat() method instead
  //split numeric to parts
  let [int, reminder] = value.split('.');
  let res = '';
  //split digit groups
  while (int.length > 3) {
    res = separator + int.substring(int.length - 3) + res;
    int = int.substring(0, int.length - 3);
  }
  //strip negative sign
  if (int === '-') {
    res = res.substring(1);
  }
  res = int + res;
  if (reminder) {
    res += '.' + reminder;
  }
  if (trimTrailingZeros) {
    res = stripTrailingZeros(res);
  }
  return res;
}

/**
 * Check if a provided value can be safely used as token amount in Stellar operations
 * @param {String} value
 * @param {Boolean} denominate
 * @param {Boolean} nonZero
 * @return {Boolean}
 */
function isValidInt64Amount(value, denominate = true, nonZero = false) {
  try {
    const parsed = denominate ? toStroops(value) : BigInt(value);
    if (nonZero) {
      if (parsed <= 0n) return false;
    } else {
      if (parsed < 0n) return false;
    }
    return parsed <= 9223372036854775807n;
  } catch (e) {
    return false;
  }
}

/**
 * Format a number with specified precision and decimals separator
 * @param {String|Number|BigInt} value - Numeric value to format
 * @param {Number} [precision] - Desired precision (7 digits by default)
 * @param {String} [separator] - Decimals separator
 * @return {String}
 */
function formatWithPrecision(value, precision = 7, separator = ',') {
  return addDecimalsSeparators(setPrecision(value, precision), separator, true);
}

/**
 * Format a number using automatically determined precision
 * @param {String|Number} value - Numeric value to format
 * @param {String} [separator] - Decimals separator
 * @return {String}
 */
function formatWithAutoPrecision(value, separator = ',') {
  if (!value) return '0';
  const p = Math.ceil(Math.log10(parseFloat(value)));
  let reminderPrecision = p > 1 ? 3 - p : Math.abs(p) + 2;
  if (reminderPrecision < 0) {
    reminderPrecision = 0;
  }
  return formatWithPrecision(value, reminderPrecision, separator);
}

/**
 * Convert a number to a human-readable format using abbreviation
 * @param {Number} value - Value to format
 * @param {Number} [decimals] - Precision of the abbreviated string to retain
 * @return {String}
 */
function formatWithAbbreviation(value, decimals = 2) {
  let abs = Math.abs(value);
  const tier = Math.log10(abs) / 3 | 0;
  if (tier <= 0) return formatWithAutoPrecision(value);
  const suffix = ['', 'K', 'M', 'G', 'T', 'P'][tier];
  abs = stripTrailingZeros((abs / Math.pow(10, tier * 3)).toFixed(decimals));
  return `${value < 0 ? '-' : ''}${abs || '0'}${suffix}`;
}

/**
 * Format a number with rounding to specific precision group
 * @param {String|Number|BigInt} value - Value to format
 * @param {Number} group - Logarithmic group rate for rounding
 * @return {String}
 */
function formatWithGrouping(value, group) {
  if (!value) return '0';
  const precision = group >= 1 || group === 0 ? 0 : Math.abs(Math.log10(group));
  if (group >= 1) {
    value = Math.ceil(value / group) * group;
  }
  return formatWithPrecision(value, precision);
}

/**
 * Format a number as price with specified significant digits precision
 * @param {String|Number|Bignumber} value - Value to format
 * @param {Number} significantDigits - Significant digits for automatic formatting
 * @return {String}
 */
function formatPrice(value, significantDigits = 4) {
  const primitive = typeof value === 'number' ? value.toFixed(7) : value.toString();
  const [int, fract] = primitive.split('.');
  if (int.replace('-', '') !== '0') {
    significantDigits -= int.length;
    if (significantDigits < 0) {
      significantDigits = 0;
    }
  } else {
    if (!(fract > 0)) return '0';
    significantDigits = Math.max(Math.ceil(Math.abs(Math.log10(parseFloat('.' + fract)))), significantDigits);
  }
  return formatWithPrecision(value, significantDigits, '');
}

/**
 * Format amount according to default Stellar precision
 * @param {Number|String} amount - Value to format
 * @return {String}
 */
function adjustPrecision(amount = '0') {
  return stripTrailingZeros(setPrecision(amount, 7));
}
function setPrecision(amount, precision) {
  if (typeof amount === 'number') {
    amount = amount.toFixed(precision);
  } else {
    amount = amount.toString();
    const sidx = amount.indexOf('.');
    if (sidx >= 0) {
      amount = amount.slice(0, sidx + precision + 1);
    }
  }
  return amount;
}
;// CONCATENATED MODULE: ./src/timestamp-format.js
/**
 * Convert any timestamp representation to a valid date format
 * @param {Date|String|Number} date - Date to parse
 * @param {Boolean} [autoUnixFormatDetection] - Intelligent guess for dates already represented as UNIX timestamp (true by default)
 * @return {Date} Parsed date
 */
function normalizeDate(date, autoUnixFormatDetection = true) {
  //try parse string representation
  if (typeof date === 'string') {
    if (!/^\d+$/.test(date)) {
      if (!date.endsWith('Z')) {
        date += 'Z';
      }
      date = new Date(date);
    } else {
      date = parseInt(date);
    }
  }
  //parse numeric representation
  if (typeof date === 'number') {
    //input resembles a UNIX timestamp
    if (date < 2147483648 && autoUnixFormatDetection) {
      date *= 1000;
    }
    date = new Date(date);
  }
  //check validity
  if (!(date instanceof Date) || isNaN(date.valueOf())) throw new Error('Invalid timestamp ' + date);
  return date;
}

/**
 * Convert date to a numeric UNIX timestamp representation
 * @param {Date|String|Number} date - Date to convert
 * @return {Number} UNIX timestamp
 */
function toUnixTimestamp(date) {
  return Math.floor(normalizeDate(date).getTime() / 1000);
}

/**
 * Convert date to ISO-like human-readable format
 * @param {Date|String|Number} date - Date to convert
 * @return {String}
 */
function formatDateUTC(date) {
  return normalizeDate(date).toISOString().replace(/(T|\.\d+Z)/g, ' ') // make it more human friendly
  .trim();
}
;// CONCATENATED MODULE: ./src/approximation.js
/**
 * Convert rational price representation to Number
 * @param {{n: Number, d: Number}|Number|String} price
 * @return {Number}
 */
function approximatePrice(price) {
  if (!price) return 0;
  if (price.n) return price.n / price.d;
  if (typeof price === 'string') return parseFloat(price);
  return price;
}
;// CONCATENATED MODULE: ./src/commonjs.js





const formatter = {
  adjustPrecision: adjustPrecision,
  formatWithAutoPrecision: formatWithAutoPrecision,
  formatWithAbbreviation: formatWithAbbreviation,
  formatWithGrouping: formatWithGrouping,
  formatWithPrecision: formatWithPrecision,
  formatPrice: formatPrice,
  isValidInt64Amount: isValidInt64Amount,
  formatDateUTC: formatDateUTC,
  normalizeDate: normalizeDate,
  toUnixTimestamp: toUnixTimestamp,
  approximatePrice: approximatePrice,
  shortenString: shortenString,
  stripTrailingZeros: stripTrailingZeros,
  toStroops: toStroops,
  fromStroops: fromStroops
};
/* harmony default export */ const commonjs = (formatter);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=formatter.js.map