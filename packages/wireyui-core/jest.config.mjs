const common = require('../../common-config/jest.config.cjs');

module.exports = {
    ...common,
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.withtests.json'
        }
    }
}