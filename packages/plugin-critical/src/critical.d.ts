declare module 'critical' {
  import * as through2 from 'through2'

  interface CriticalOptions {
    html?: string
    src?: string | object
    css?: string | string[]
    base?: string
    strict?: boolean
    ignoreInlinedStyles?: boolean
    extract?: boolean
    inlineImages?: boolean
    postcss?: any[]
    ignore?: string[] | Record<string, unknown>
    width?: number
    height?: number
    dimensions?: { width: number; height: number }[]
    inline?: boolean | Record<string, unknown>
    maxImageFileSize?: number
    include?: any
    concurrency?: number
    user?: string
    pass?: string
    request?: Record<string, unknown>
    penthouse?: {
      timeout?: number
      forceInclude?: string[] | unknown
      maxEmbeddedBase64Length?: number
      [key: string]: unknown
    }
    rebase?:
      | {
          from: string
          to: string
        }
      | ((...args: any[]) => any)
      | boolean
    target?:
      | string
      | {
          css?: string
          html?: string
          uncritical?: string
        }
    assetPaths?: string[]
    userAgent?: string
    cleanCSS?: Record<string, unknown>
  }

  interface CriticalResult {
    html: string
    css: string
    uncritical?: string
  }

  /**
   * Critical path CSS generation
   *
   * @param {object} params Options
   * @param {function} cb Callback
   * @returns {Promise<object>} Result object with html, css & optional extracted original css
   */
  export function generate(
    params: CriticalOptions,
    cb?: (error: Error | null, result: CriticalResult | undefined) => void
  ): Promise<CriticalResult>

  /**
   * Streams wrapper for critical
   *
   * @param {object} params Critical options
   * @returns {stream} Gulp stream
   */
  export function stream(params: CriticalOptions): through2.Through2

  export namespace generate {
    const stream: typeof stream
  }
}
