export default {
    input: [
        './build/esm/index.js',
        './build/esm/jsx-runtime.js',
    ],
    output: {
        format: 'commonjs',
        dir: './build/cjs'
    },
    external: ['@captainpants/sweeter-core']
  };