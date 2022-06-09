import pino from 'pino';

export default pino({
  name: process.env.SERVICE_NAME,
  level: process.env.LOG_LEVEL,
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
});
