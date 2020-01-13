cd ~/builds/c0d3
mv build/index.html public/index.html
pm2 startOrRestart ecosystem.config.js --env production --update-env
