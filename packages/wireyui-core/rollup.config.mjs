export default {
    input: [
        './build/index.js',
        './build/jsx-runtime.js',
    ],
    output: {
        format: 'commonjs',
        dir: './build/cjs'
    },
  };