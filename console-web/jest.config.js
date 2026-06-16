/**
 * Jest config for console-web (Vue 2 中台).
 *
 * IMPORTANT: tests are transpiled with @swc/jest (Rust), NOT babel. The project
 * pins an old @babel/core (7.16, via @vue/cli 4.5) that the production build
 * depends on; sharing babel with jest forces a version bump that breaks the
 * Vue build. swc sidesteps babel entirely, so test tooling never touches the
 * build toolchain.
 *
 * - tier ① pure-logic unit tests run in a plain node env (no DOM needed)
 * - testMatch only picks *.test.js (NOT bare app files named test.js)
 * - moduleNameMapper mirrors the Vue CLI "@/*" -> "src/*" alias
 *
 * Component tests (tier ②) would add testEnvironment: 'jsdom' + a .vue
 * transform; E2E (tier ③) lives in a separate "test:e2e" script for CI.
 */
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['<rootDir>/src/**/*.test.js'],
    moduleFileExtensions: ['js', 'json'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.js$': ['@swc/jest'],
    },
};
