cd ~/builds/c0d3
git checkout -f
git pull origin master
yarn
CI=false yarn build
