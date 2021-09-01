const winston = require('winston');

export const Logger = winston.createLogger({
  format: winston.format.simple(),
  levels: ['debug'],
  transports: [new winston.transports.Console()],
});
