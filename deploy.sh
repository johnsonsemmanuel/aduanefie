git pull
yarn run build
pm2 delete "aduanefie-web-next-js-dev"
pm2 start npm --name "aduanefie-web-next-js-dev" -- start
