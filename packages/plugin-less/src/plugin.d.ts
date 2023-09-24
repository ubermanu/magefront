/// <reference types="less" />
import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'

export function magentoImportPreprocessor(modules: string[]): Less.Plugin

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  magentoImport?: boolean
  plugins?: Less.Plugin[]
  compilerOptions?: Less.Options
}

export default function (options?: Options): Plugin
