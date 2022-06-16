module.exports = {
  apps : [
    {
      name: "restApiProxy",
      script: "./restApiProxy/src/index.js",
      watch: ['./restApiProxy/src'],
      watch_delay: 1000,
    },
    {
      name: "socketIoService",
      script: "./socketIoService/src/index.js",
      watch: ['./socketIoService/src'],
      watch_delay: 1000,
    },
    {
      name: "authService",
      script: "./authService/src/index.js",
      watch: ['./authService/src'],
      watch_delay: 1000,
    },
    {
      name: "channelService",
      script: "./channelService/src/index.js",
      watch: ['./channelService/src'],
      watch_delay: 1000,
    },
    {
      name: "videoService",
      script: "./videoService/src/index.js",
      watch: ['./videoService/src'],
      watch_delay: 1000,
    },
    {
      name: "ytPostProcessorService",
      script: "./ytPostProcessorService/src/index.js",
      watch: ['./ytPostProcessorService/src'],
      watch_delay: 1000,
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
      'post-deploy' : 'yarn install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
