module.exports = {
  apps: [
    {
      name: 'c0d3-prod',
      script: './Server/app.js',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
