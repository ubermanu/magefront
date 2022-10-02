/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as types from '@babel/types'
import type { Function, Expression, CallExpression } from '@babel/types'

const INTEROP_FUNCTION_NAME = '_interopRequire'

/**
 * @param path
 * @return {Expression|false}
 */
function findExpression(path: any): Expression | false {
  if (!types.isExpressionStatement(path.node)) {
    return false
  }

  return path.get('expression')
}

/**
 * @param path
 * @param objectName
 * @param propertyName
 */
function isObjectProperty(path: any, objectName: string, propertyName: string): boolean {
  return (
    types.isMemberExpression(path) &&
    path.get('object').isIdentifier(types.identifier(objectName)) &&
    path.get('property').isIdentifier(types.identifier(propertyName))
  )
}

/**
 * @param path
 */
export function extractDependencyAndFactory(path: any): { dependencies: string; factory: string } {
  const args = path.node.arguments
  const dependencies = path.get('arguments.' + (args.length - 2))
  const factory = path.get('arguments.' + (args.length - 1))

  return {
    dependencies: dependencies,
    factory: factory
  }
}

/**
 * @param path
 */
export function findAmdModule(path: any): CallExpression | false {
  if (!path.parentPath.isProgram()) {
    return false
  }

  const expression = findExpression(path)

  if (
    !expression ||
    !types.isCallExpression(expression) ||
    !types.isIdentifier(expression.node.callee, {
      name: 'define'
    })
  ) {
    return false
  }

  const _extractDependencyAnd = extractDependencyAndFactory(expression),
    dependencies = _extractDependencyAnd.dependencies,
    factory = _extractDependencyAnd.factory

  if (dependencies && factory) {
    return expression
  }

  return false
}

/**
 * @param path
 */
export function extractDependencyMap(path) {
  const dependencyMap = {}

  const _extractDependencyAnd2 = extractDependencyAndFactory(path),
    dependencies = _extractDependencyAnd2.dependencies,
    factory = _extractDependencyAnd2.factory

  const dependencyList = dependencies.node.elements
  const factoryParams = factory.node.params

  dependencyList.forEach(function (dependency, index) {
    if (factoryParams[index]) {
      dependencyMap[dependency.value] = factoryParams[index]
    }
  })

  return dependencyMap
}

/**
 * @param path
 */
export function removeExportsDependency(path) {
  const _extractDependencyAnd3 = extractDependencyAndFactory(path),
    dependencies = _extractDependencyAnd3.dependencies,
    factory = _extractDependencyAnd3.factory

  const dependencyMap = extractDependencyMap(path)

  if (!dependencyMap.exports) {
    return
  }

  dependencies.node.elements = dependencies.node.elements.filter(function (item) {
    return !types.isStringLiteral(item, { value: 'exports' })
  })

  factory.node.params = factory.node.params.filter(function (item) {
    return !types.isIdentifier(item, dependencyMap.exports)
  })
}

/**
 * @param path
 * @param scope
 */
export function isEsModulePropertyDefinition(path, scope) {
  const callExpression = findExpression(path)
  const callee = callExpression.get('callee')
  const callArguments = callExpression.node.arguments
  const isObjectDefinePropertyCall = isObjectProperty(callee, 'Object', 'defineProperty')

  if (isObjectDefinePropertyCall) {
    const isEsModulePropertyInArguments = types.isStringLiteral(callArguments[1], { value: '__esModule' })
    const isInScope = types.isIdentifier(callArguments[0], scope)
    return isEsModulePropertyInArguments && isInScope
  }

  return false
}

/**
 * @param path
 * @param objectId
 */
export function isObjectAssignment(path, objectId) {
  const expression = types.isAssignmentExpression(path) ? path : findExpression(path)
  const isMemberAssignment = types.isAssignmentExpression(expression) && types.isMemberExpression(expression.get('left'))

  if (isMemberAssignment) {
    return types.isNodesEquivalent(expression.get('left.object').node, objectId)
  }

  return false
}

/**
 * @param path
 */
export function isVoidExpression(path) {
  return types.isUnaryExpression(path) && path.node.operator === 'void'
}

/**
 * @param path
 */
export function isInteropRequireCall(path) {
  const expression = findExpression(path)
  const isAssignmentCall = types.isAssignmentExpression(expression) && types.isCallExpression(expression.get('right'))

  if (isAssignmentCall) {
    const callee = expression.get('right.callee')
    return callee.isIdentifier() && callee.node.name.indexOf(INTEROP_FUNCTION_NAME) === 0
  }

  return false
}

/**
 * @param {Function} path
 */
export function isInteropRequireDefinition(path: Function) {
  if (types.isFunction(path) && path.node.id) {
    return path.node.id.name.indexOf(INTEROP_FUNCTION_NAME) === 0
  }

  return false
}
