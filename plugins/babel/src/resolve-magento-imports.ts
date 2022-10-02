/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import path from 'path'

/**
 * Convert the relative path imports within TypeScript into absolute paths with pre-fixed module name
 *
 * @returns {{visitor: {ImportDeclaration: visitor.ImportDeclaration}}}
 */
export default () => ({
  visitor: {
    /**
     * Convert ../../utils/util import into Magento_Module/js/utils/util
     *
     * @param {Object} importPath
     * @param {Object} state
     * @constructor
     */
    ImportDeclaration: function (importPath: any, state: any) {
      const importExpression = importPath.node.source.value

      if (!state.opts.prefix) {
        throw Error('Prefix must be defined')
      }

      // Is the file being imported from another directory?
      if (!path.isAbsolute(importExpression) && importExpression.includes('./')) {
        importPath.node.source.value = path
          .resolve(path.dirname(state.file.opts.filename.replace(state.opts.path, '')), importExpression)
          .replace(process.cwd(), state.opts.prefix.replace(/\/+$/, ''))
      }
    }
  }
})
