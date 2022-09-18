import path from 'path'
import winston from 'winston'
import type { Logger } from 'winston'

/**
 * The current project root path.
 * @type {string}
 */
export let rootPath = process.cwd()

/**
 * Set the project root path.
 * This is mostly used for testing.
 * TODO: Might be a nice to allow path as an arg in CLI.
 *
 * @param {string} newPath
 * @internal
 */
export const setRootPath = (newPath: string) => {
  rootPath = path.resolve(newPath)
}

/**
 * Return the path to the temporary directory.
 * This is where all the files are merged together during the `inheritance` process.
 *
 * Once the inheritance process is done, the plugins are run here.
 *
 * Then the `deploy` process copies the files from the temporary directory
 * to the destination directory, which is `pub/static` by default.
 *
 * @returns {string}
 */
export const tempPath = 'var/view_preprocessed/magefront'

/**
 * Instance of the logger with a silent console by default.
 *
 * @type {Logger}
 */
export const logger: Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console({ silent: true })]
})
