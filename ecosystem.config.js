module.exports = {
  apps: [
    {
      name: 'c0d3-prod',
      script: './Server/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        REACT_APP_SERVER_URL: 'https://c0d3.com',
        HOST_NAME: 'c0d3.com',
        CLIENT_URL: 'https://c0d3.com'
      },
    },
  ],
}
