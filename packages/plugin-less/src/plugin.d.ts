/// <reference types="less" />
import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'

declare const magentoImportPreprocessor: (modules: string[]) => Less.Plugin

interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  magentoImport?: boolean
  plugins?: Less.Plugin[]
  compilerOptions?: Less.Options
}

declare const _default: (options?: Options) => Plugin

export { _default as default, magentoImportPreprocessor, type Options }
