import {toStroops, fromStroops} from '../src/stroops'

describe('toStroops', () => {
    const testCases = [
        [0, undefined, 0n],
        ['0', undefined, 0n],
        [123, undefined, 1230000000n],
        [-1, undefined, -10000000n],
        [0.0000001, undefined, 1n],
        ['12', undefined, 120000000n],
        ['-0.00032', undefined, -3200n],
        ['1000000000000.0000001', undefined, 10000000000000000001n],
        ['170141183460469231731687303715884105727', 0, 0x7fffffffffffffffffffffffffffffffn],
        ['17014118346046923173168730371588410572.7', 1, 0x7fffffffffffffffffffffffffffffffn],
        ['1.70141183460469231731687303715884105727', 38, 0x7fffffffffffffffffffffffffffffffn],
        ['170141183460469231731687303715884105727', -1, 0x7fffffffffffffffffffffffffffffffn],
        ['1.70141183460469231731687303715884105727', 39, 0x7fffffffffffffffffffffffffffffffn]
    ]

    test.each(testCases)('toStroops(%p, %d)->%p', (src, decimals, expected) => {
        expect(toStroops(src, decimals)).toEqual(expected)
    })
})

describe('fromStroops', () => {
    const testCases = [
        [0n, undefined, '0'],
        [0, undefined, '0'],
        ['0', undefined, '0'],
        [null, undefined, '0'],
        [1230000000n, undefined, '123'],
        [-100000000, undefined, '-10'],
        [-3200, undefined, '-0.00032'],
        [1, undefined, '0.0000001'],
        [10000000000000000001n, undefined, '1000000000000.0000001'],
        [0x7fffffffffffffffffffffffffffffffn, 0, '170141183460469231731687303715884105727'],
        [0x7fffffffffffffffffffffffffffffffn, 1, '17014118346046923173168730371588410572.7'],
        [0x7fffffffffffffffffffffffffffffffn, 38, '1.70141183460469231731687303715884105727'],
        [0x7fffffffffffffffffffffffffffffffn, -1, '170141183460469231731687303715884105727'],
        [0x7fffffffffffffffffffffffffffffffn, 39, '1.70141183460469231731687303715884105727']
    ]

    test.each(testCases)('fromStroops(%p, %d)->%p', (src, decimals, expected) => {
        expect(fromStroops(src, decimals)).toEqual(expected)
    })
})
