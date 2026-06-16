/**
 * Jest config for the ejyy api-server (Koa + TypeScript).
 * - ts-jest compiles the TS tests on the fly (no separate build step)
 * - moduleNameMapper mirrors the project's "~/*" -> "src/*" path alias so
 *   tests can import application code exactly the way the app does
 */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1',
    },
};
