module.exports = {
  apps: [
    {
      name: 'delete',
      cwd: '~/builds/delete',
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

  deploy: {
    production: {
      user: 'gitlab-runner',
      host: '120.0.0.1',
      ref: 'origin/master',
      repo: 'git@git.c0d3.com:trifrog/c0d3.git',
      path: '~/builds/delete',
      'post-deploy':
        `yarn && \
        yarn build && \
        pm2 reload ecosystem.config.js || \
        pm2 start ecosystem.config.js`,
    },
  },
}
