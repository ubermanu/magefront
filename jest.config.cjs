module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^magefront-plugin-less$': '<rootDir>/packages/plugin-less/src/plugin.js',
    '^magefront-plugin-requirejs-config$': '<rootDir>/packages/plugin-requirejs-config/src/plugin.js',
    '^magefront-plugin-js-translation$': '<rootDir>/packages/plugin-js-translation/src/plugin.js',
    '^magefront-preset-default$': '<rootDir>/packages/preset-default/src/preset.js',
  },
  testMatch: ['**/tests/*.test.js'],
  setupFiles: ['<rootDir>/jest.setup.js'],
}
