/**
 * Fixes some issues caused by the upgrade of the LESS version.
 * Magento 2 uses LESS version ~2.3.1, which is very old.
 */
class preProcessor {
  process(src) {
    // Fix "Operation on an invalid type" error caused when the minus sign
    // is set in front of a variable.
    src = src.replace(/ -@([a-z_-]+)/gi, (match, v) => ` -(@${v})`)

    // Fix "Error evaluating function `unit`: the first argument to unit must be a number"
    // Wrap the first argument of the `unit` function in parentheses.
    src = src.replace(/ unit\((.*)\)/gi, (match, args) => {
      const parts = args.split(',')
      parts[0] = '(' + parts[0] + ')'
      return ` unit(${parts.join(',')})`
    })

    // Fix an error in the calculation of a variable in the `sections.less` file.
    src = src.replace(
      /^(@[\w_-]+):\s(@[\w_-]+\s\+\s@[\w_-]+.*);/gim,
      (match, v1, v2) => `${v1}: (${v2});`
    )

    return src
  }
}

export default () => ({
  install: function (less, pluginManager) {
    pluginManager.addPreProcessor(new preProcessor())
  }
})
