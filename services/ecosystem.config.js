module.exports = {
  apps : [
    {
      name: "restApiProxy",
      script: "./restApiProxy/src/index.js",
      watch: ['./restApiProxy/src'],
      watch_delay: 1000,
      env: {
        "SERVICE_NAME": "restApiProxy",
        "SERVICE_VERSION": "1.0.0",
        "API_HOST": "localhost",
        "API_PORT": 3000,
        "LOG_PATH": "./restApiProxy/logs",
      }
    },
    {
      name: "socketIoService",
      script: "./socketIoService/src/index.js",
      watch: ['./socketIoService/src'],
      watch_delay: 1000,
      env: {
        "SERVICE_NAME": "socketIoService",
        "SERVICE_VERSION": "1.0.0",
        "API_HOST": "localhost",
        "API_PORT": 3001,
        "LOG_PATH": "./socketIoService/logs",
      }
    },
    {
      name: "authService",
      script: "./authService/src/index.js",
      watch: ['./authService/src'],
      watch_delay: 1000,
      env: {
        "SERVICE_NAME": "authService",
        "SERVICE_VERSION": "1.0.0",
        "API_HOST": "localhost",
        "API_PORT": 3002,
        "LOG_PATH": "./authService/logs",
      }
    },
    {
      name: "channelService",
      script: "./channelService/src/index.js",
      watch: ['./channelService/src'],
      watch_delay: 1000,
      env: {
        "SERVICE_NAME": "channelService",
        "SERVICE_VERSION": "1.0.0",
        "API_HOST": "localhost",
        "API_PORT": 3003,
        "LOG_PATH": "./channelService/logs",
      }
    },
    {
      name: "videoService",
      script: "./videoService/src/index.js",
      watch: ['./videoService/src'],
      watch_delay: 1000,
      env: {
        "SERVICE_NAME": "videoService",
        "SERVICE_VERSION": "1.0.0",
        "API_HOST": "localhost",
        "API_PORT": 3004,
        "LOG_PATH": "./videoService/logs",
      }
    },
    {
      name: "ytPostProcessorService",
      script: "./ytPostProcessorService/src/index.js",
      watch: ['./ytPostProcessorService/src'],
      watch_delay: 1000,
      env: {
        "SERVICE_NAME": "ytPostProcessorService",
        "SERVICE_VERSION": "1.0.0",
        "API_HOST": "localhost",
        "API_PORT": 3005,
        "LOG_PATH": "./ytPostProcessorService/logs",
      }
    },
  ],
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
