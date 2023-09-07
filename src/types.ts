import type { Logger } from 'winston'

// A package from a `composer.lock` file.
export interface ComposerPackage {
  name: string
  type: string
  autoload?: {
    files?: string[]
  }
}

export interface MagentoModule {
  name: string
  src: string
  enabled: boolean
}

export interface MagentoLanguage extends MagentoModule {
  code: string | false
}

export interface MagentoTheme extends MagentoModule {
  area: string
  parent: string | false
  dest: string
}

// Extends the themeConfig with additional values to be passed to the plugin when it's running.
export type PluginContext = {
  theme: string
  src: string
  dest: string
  locale: string
  modules: string[]
  moduleList: MagentoModule[]
  languageList: MagentoLanguage[]
  themeList: MagentoTheme[]
  themeDependencyTree: string[]
  cwd: string
  logger: Logger
}

export type Plugin = (context: PluginContext) => Promise<void>

// The preset configuration object. Contains already defined plugins (because we cannot resolve them at the module level).
export type Preset = {
  plugins?: Plugin[]
}
