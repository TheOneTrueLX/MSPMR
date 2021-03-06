import pino from 'pino';

const l = pino({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL,
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
});

export default l;
