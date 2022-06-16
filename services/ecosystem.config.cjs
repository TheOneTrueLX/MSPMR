module.exports = {
  apps : [
    {
      name: "restApiProxy",
      script: "yarn dev:restApiProxy",
      watch: ['./restApiProxy/src'],
      watch_delay: 1000,
    },
    {
      name: "socketIoService",
      script: "yarn dev:socketIoService",
      watch: ['./socketIoService/src'],
      watch_delay: 1000,
    },
    {
      name: "authService",
      script: "yarn dev:authService",
      watch: ['./authService/src'],
      watch_delay: 1000,
    },
    {
      name: "channelService",
      script: "yarn dev:channelService",
      watch: ['./channelService/src'],
      watch_delay: 1000,
    },
    {
      name: "videoService",
      script: "yarn dev:videoService",
      watch: ['./videoService/src'],
      watch_delay: 1000,
    },
    {
      name: "ytPostProcessorService",
      script: "yarn dev:ytPostProcessorService",
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
