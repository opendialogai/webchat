#!/usr/bin/env bash

cd vendor/opendialogai/webchat

rm -rf node_modules/vue-beautiful-chat

npm install

npm run dev

cd ../../../

rm -r public/vendor/webchat

php artisan vendor:publish --tag=public --force

php artisan vendor:publish --tag=vue-components --force
