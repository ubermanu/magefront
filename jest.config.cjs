module.exports = {
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^magefront-plugin-less$': '<rootDir>/packages/plugin-less/src/plugin.ts',
    '^magefront-plugin-requirejs-config$': '<rootDir>/packages/plugin-requirejs-config/src/plugin.ts',
    '^magefront-plugin-js-translation$': '<rootDir>/packages/plugin-js-translation/src/plugin.ts',
    '^magefront-preset-default$': '<rootDir>/packages/preset-default/src/preset.ts',
  },
  testMatch: ['**/tests/*.test.ts'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
}
