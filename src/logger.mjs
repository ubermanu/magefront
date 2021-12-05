import winston from 'winston'

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: '.magefront-debug.log' })
  ]
})

export default logger
