import {
    formatWithAutoPrecision,
    formatWithPrecision,
    formatWithAbbreviation,
    formatWithGrouping,
    formatPrice,
    adjustPrecision,
} from '../src/numeric-format'

describe('formatWithAutoPrecision', () => {
    const testCases = [
        [6, '6'],
        [1234.565464, '1,235'],
        [1.23412, '1.234'],
        [0.0000001, '0.0000001'],
        [0.0010001, '0.001'],
        [1234546454, '1,234,546,454'],
        [1234546454.222, '1234546454', ''],
        [450000000, '450,000,000', ',']
    ]

    test.each(testCases)('formatWithAutoPrecision(%p)->%p', (src, expected, separator = undefined) => {
        expect(formatWithAutoPrecision(src, separator)).toEqual(expected)
    })
})

describe('formatWithPrecision', () => {
    const testCases = [
        [6, '6'],
        [1234.565464, '1,234.57', 2],
        [1.23412, '1.234', 3],
        [0.0000001, '0.0000001'],
        [0.0010001, '0.001', 3],
        [1234546454, '1,234,546,454'],
        [1234546454.222, '1234546454', 0, ''],
        ['450000000', '450,000,000']
    ]

    test.each(testCases)('formatWithPrecision(%p)->%p', (src, expected, precision = undefined, separator = undefined) => {
        expect(formatWithPrecision(src, precision, separator)).toEqual(expected)
    })
})

describe('formatWithAbbreviation', () => {
    const testCases = [
        [6, '6'],
        [1234.565464, '1.23K'],
        [1.23412, '1.234'],
        [0.0000001, '0.0000001'],
        [0.0010001, '0.001'],
        [10000000, '10M'],
        [1234546454, '1.23G'],
        [1234546454.222, '1.23455G', 5]
    ]

    test.each(testCases)('formatWithAbbreviation(%p)->%p', (src, expected, decimals = undefined) => {
        expect(formatWithAbbreviation(src, decimals)).toEqual(expected)
    })
})

describe('formatWithGrouping', () => {
    const testCases = [
        //[6, 1000, '6'],
        [1234.5654647, 0, '1,235'],
        [1234.5654647, 10, '1,240'],
        [1234.5654647, 1000, '2,000'],
        [1234.5654647, 1000000, '1,000,000'],
        [1234.5654647, 0.1, '1,234.6'],
        [1234.5654647, 0.001, '1,234.565'],
        [1234.5654647, 0.000001, '1,234.565465']
    ]

    test.each(testCases)('formatWithGrouping(%p, %p)->%p', (src, decimalsGroup, expected) => {
        expect(formatWithGrouping(src, decimalsGroup)).toEqual(expected)
    })
})

describe('formatPrice', () => {
    const testCases = [
        [0, '0'],
        [6, '6'],
        [0.0000011, '0.000001'],
        [0.0000001, '0.0000001'],
        [0.0010001, '0.001'],
        [1.23412, '1.234'],
        [1.23412, '1.2341', 5],
        [1.23412, '1.23', 3],
        [1234.565464, '1235'],
        [1234546454, '1234546454'],
        [1234546454.222, '1234546454', '']
    ]

    test.each(testCases)('formatWithAutoPrecision(%p)->%p', (src, expected, digits = 4) => {
        expect(formatPrice(src, digits)).toEqual(expected)
    })
})

describe('adjustPrecision', () => {
    const testCases = [
        ['1000000.0010001', '1000000.0010001'],
        [0, '0'],
        [1, '1'],
        [1000, '1000'],
        [0.0000001, '0.0000001'],
        [0.0010001, '0.0010001'],
        [1.234120111111, '1.2341201']
    ]

    test.each(testCases)('adjustPrecision(%p)->%p', (src, expected) => {
        expect(adjustPrecision(src)).toEqual(expected)
    })
})