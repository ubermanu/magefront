import winston, { type Logger } from 'winston'

export const createLogger = (): Logger => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    transports: [new winston.transports.Console({ silent: true })],
  })
}
