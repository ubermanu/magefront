declare namespace magefront {
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
    code: string
  }

  export interface MagentoTheme extends MagentoModule {
    area: string
    dest: string
    parent: MagentoTheme | null
  }

  // Extends the themeConfig with additional values to be passed to the plugin when it's running.
  export type PluginContext = {
    theme: MagentoTheme
    themeDependencyTree: MagentoTheme[]
    cwd: string
    locale: string
    magento: {
      modules: MagentoModule[]
      languages: MagentoLanguage[]
      themes: MagentoTheme[]
      rootPath: string
    }
    logger: import('winston').Logger
  }

  export interface Plugin {
    name: string
    build(context: PluginContext): Promise<void>
  }

  // The preset configuration object. Contains already defined plugins (because we cannot resolve them at the module level).
  export type Preset = {
    plugins?: Plugin[]
  }

  // The configuration object that is passed as build context.
  // The preset plugins are resolved and merged into the plugins array.
  export type BuildConfig = {
    tmp: string
    dest: string
    plugins: Plugin[]
  }

  // The options that can be passed to the `magefront` function.
  export type MagefrontOptions = {
    /** The name of the theme to build. e.g. `Magento/blank`. */
    theme: string

    /** The locale to build the theme for. e.g. `en_US`. */
    locale?: string

    /** The list of presets to use. */
    presets?: Array<Preset | string | [string, unknown]>

    /** The list of plugins to use. */
    plugins?: Array<Plugin | string | [string, unknown]>

    magento?: {
      /** The path to the magento root directory. */
      rootPath?: string
    }

    /**
     * The path to the `magefront.config.js` file.
     *
     * @internal
     */
    configFilename?: string
  }

  /**
   * The configuration object or array that is read from the
   * `magefront.config.js` file.
   *
   * The `theme` option is required when the config is an array.
   */
  export type Config = Partial<MagefrontOptions> | MagefrontOptions[]

  type MaybePromise<T> = T | Promise<T>

  export type Action = (context: ActionContext) => MaybePromise<void>

  // The context object that is passed to the action functions.
  export type ActionContext = {
    theme: MagentoTheme
    locale: string
    logger: import('winston').Logger
    buildConfig: BuildConfig
    magento: {
      rootPath: string
      tempPath: string
      modules: MagentoModule[]
      languages: MagentoLanguage[]
      themes: MagentoTheme[]
    }
  }

  // The context object that is passed to the magento functions.
  export type MagentoContext = {
    packages: ComposerPackage[]
    rootPath: string
    tempPath: string
  }

  export function magefront(options: MagefrontOptions): Promise<void>

  export function defineConfig<T extends Config>(config: T): T
}

export = magefront
