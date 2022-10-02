/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as t from '@babel/types'
import * as ast from './ast-utils'

/**
 * @param path
 * @param state
 */
function replaceExportAssignment(path, state) {
  const property = path.get('left.property')
  const expression = path.get('right')
  path.remove()

  if (ast.isVoidExpression(expression)) {
    return
  }

  if (property.isIdentifier({ name: 'default' })) {
    state.defaultExport = expression.node
    return
  }

  state.exports.push(t.objectProperty(property.node, expression.node))
}

const memberExpressionVisitor = {
  /**
   * @param path
   * @param state
   * @constructor
   */
  MemberExpression: (path, state) => {
    const matchedDependencies = state.dependencies.filter((item) => {
      return path.get('object').isIdentifier({ name: item.name })
    })

    const isDefaultDependency = matchedDependencies.length === 1 && path.get('property').isIdentifier({ name: 'default' })
    if (isDefaultDependency) {
      path.replaceWith(matchedDependencies[0])
    }
  }
}

const functionBodyVisitor = {
  /**
   * @param path
   * @param state
   * @constructor
   */
  ExpressionStatement: (path, state) => {
    if (ast.isEsModulePropertyDefinition(path, state.scope)) {
      path.remove()
    }

    if (ast.isObjectAssignment(path, state.scope)) {
      replaceExportAssignment(path.get('expression'), state)
    }

    if (ast.isInteropRequireCall(path)) {
      path.remove()
    }
  },

  /**
   * @param path
   * @param state
   * @constructor
   */
  Function: (path, state) => {
    if (ast.isInteropRequireDefinition(path)) {
      path.remove()
    }
    path.traverse(memberExpressionVisitor, state)
  },

  /**
   * @param path
   * @param state
   * @constructor
   */
  ClassMethod: function ClassMethod(path, state) {
    path.traverse(memberExpressionVisitor, state)
  },

  /**
   * @param path
   * @constructor
   */
  DirectiveLiteral: function DirectiveLiteral(path) {
    if (path.node.value === 'use strict') {
      path.parentPath.remove()
    }
  },

  /**
   */
  MemberExpression: memberExpressionVisitor.MemberExpression
}

/**
 * @param path
 */
function processAmdDefinition(path) {
  const _extractDependencyAnd = ast.extractDependencyAndFactory(path),
    factory = _extractDependencyAnd.factory

  const dependencyMap = ast.extractDependencyMap(path)

  if (dependencyMap.exports) {
    ast.removeExportsDependency(path)
    const state = {
      scope: dependencyMap.exports,
      dependencies: Object.values(dependencyMap),
      exports: []
    }

    factory.traverse(functionBodyVisitor, state)
    let returnStatement = t.objectExpression(state.exports)

    if (state.defaultExport) {
      returnStatement = state.defaultExport

      if (state.exports.length > 0) {
        returnStatement = t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
          state.defaultExport,
          t.objectExpression(state.exports)
        ])
      }
    }

    factory.get('body').pushContainer('body', t.returnStatement(returnStatement))
  }
}

const programVisitor = {
  /**
   * @param path
   * @constructor
   */
  ExpressionStatement: (path) => {
    const amdModule = ast.findAmdModule(path)
    if (amdModule) {
      processAmdDefinition(amdModule)
    }
  }
}

export default () => ({
  visitor: {
    Program: {
      exit: (path) => {
        path.traverse(programVisitor)
      }
    }
  }
})
