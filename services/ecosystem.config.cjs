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
      name: "authService",
      script: "./authService/src/index.js",
      watch: ['./authService/src'],
      watch_delay: 1000,
      env: {
        "SERVICE_NAME": "authService",
        "SERVICE_VERSION": "1.0.0",
        "API_HOST": "localhost",
        "API_PORT": 3001,
        "LOG_PATH": "./authService/logs",
      }
    }
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
