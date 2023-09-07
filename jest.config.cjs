module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^magefront-plugin-less$': '<rootDir>/plugins/less/src/plugin.ts',
    '^magefront-plugin-requirejs-config$': '<rootDir>/plugins/requirejs-config/src/plugin.ts',
    '^magefront-plugin-js-translation$': '<rootDir>/plugins/js-translation/src/plugin.ts',
    '^magefront-preset-default$': '<rootDir>/presets/default/src/preset.ts',
  },
  testMatch: ['**/tests/*.test.ts'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
}
