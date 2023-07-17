import {toStroops, fromStroops} from '../src/stroops'

describe('toStroops', () => {
    const testCases = [
        [0, 0n],
        ['0', 0n],
        [123, 1230000000n],
        [-1, -10000000n],
        [0.0000001, 1n],
        ['12', 120000000n],
        ['-0.00032', -3200n],
        ['1000000000000.0000001', 10000000000000000001n]
    ]

    test.each(testCases)('toStroops(%p)->%p', (src, expected) => {
        expect(toStroops(src)).toEqual(expected)
    })
})

describe('fromStroops', () => {
    const testCases = [
        [0n, '0'],
        [0, '0'],
        ['0', '0'],
        [null, '0'],
        [1230000000n, '123'],
        [-100000000, '-10'],
        [-3200, '-0.00032'],
        [1, '0.0000001'],
        [10000000000000000001n, '1000000000000.0000001']
    ]

    test.each(testCases)('fromStroops(%p)->%p', (src, expected) => {
        expect(fromStroops(src)).toEqual(expected)
    })
})
