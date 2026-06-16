/**
 * Jest config for owner-mp (业主端微信小程序).
 * Pure-logic (tier ①) unit tests only — mini-program UI runs in the WeChat
 * runtime and can't be exercised headless. @swc/jest transpiles tests (no babel
 * in this project to conflict with). testMatch avoids bare app files named test.js.
 */
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['<rootDir>/src/**/*.test.js'],
    transform: {
        '^.+\\.js$': ['@swc/jest'],
    },
};
