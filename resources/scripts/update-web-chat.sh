#!/usr/bin/env bash

environment='dev'
if [[ "${1}" = "prod" || "${1}" = "production" ]]; then
  environment='prod'
fi

echo "Running setup for ${environment} environment"

cd vendor/opendialogai/webchat

rm -rf node_modules/vue-beautiful-chat

npm install

npm run ${environment}

cd ../../../

rm -r public/vendor/webchat

php artisan vendor:publish --tag=public --force

php artisan vendor:publish --tag=vue-components --force

echo "Updating JS and CSS version string"

rand=$(date +%s)

sed -i -e "s/JS_VERSION=.*/JS_VERSION=$rand/g" .env

sed -i -e "s/CSS_VERSION=.*/CSS_VERSION=$rand/g" .env

echo "Updates finished"