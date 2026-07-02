import terser from '@rollup/plugin-terser'

export default {
    input: 'src/bundle.js',
    output: {
        file: 'lib/formatter.js',
        format: 'umd',
        name: 'formatter',
        exports: 'default',
        sourcemap: true
    },
    plugins: [terser()]
}
