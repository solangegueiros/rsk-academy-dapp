const shell = require('shelljs')

module.exports = {
  istanbulReporter: ['html', 'lcov'],
  onCompileComplete: async function (_config) {
    await run('types')
  },
  onIstanbulComplete: async function (_config) {
    // We need to do this because solcover generates bespoke artifacts.
    shell.rm('-rf', './artifacts')
    shell.rm('-rf', './types')
  },
  providerOptions: {
    mnemonic: process.env.MNEMONIC,
  },
  skipFiles: ['mocks', 'test'],
}
