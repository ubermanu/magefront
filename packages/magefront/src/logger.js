import winston from 'winston'

export const createLogger = () => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf((info) => info.message)
    ),
    transports: [new winston.transports.Console({ silent: true })],
  })
}
