import base from '../../common-config/jest.config.mjs';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    ...base,
    testEnvironment: 'jsdom'
}