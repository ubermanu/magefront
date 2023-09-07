import path from 'node:path'
import type { Logger } from 'winston'
import winston from 'winston'

/** The current project root path. */
export let rootPath: string = process.cwd()

/** Set the project root path. This is mostly used for testing. */
// TODO: Might be a nice to allow path as an arg in CLI.
export const setRootPath = (newPath: string) => {
  rootPath = path.resolve(newPath)
}

/**
 * Return the path to the temporary directory. This is where all the files are merged together during the `inheritance` process. Once the
 * inheritance process is done, the plugins are run here. Then the `deploy` process copies the files from the temporary directory to the
 * destination directory, which is `pub/static` by default.
 */
export const tempPath: string = 'var/view_preprocessed/magefront'

/** Instance of the logger with a silent console by default. */
export const logger: Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console({ silent: true })],
})
