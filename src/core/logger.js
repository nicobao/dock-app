const winston = require('winston');

export const Logger = winston.createLogger({
  format: winston.format.simple(),
  level: 'info',
  transports: [new winston.transports.Console()],
});
