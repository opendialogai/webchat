#!/usr/bin/env bash

usage="$(basename "$0") [-h n] [-p n] [-l n] [-i n] [-f n] -- Sets up the OpenDialog webchat dependencies after an update

where:
    -h show this help text
    -p is the environment prod (defaults: false)
    -l whether to run for lando environment (default: false)
    -i whether to re-install node dependencies or not (defaults: false)
    -f whether to force refresh meaning deleting local dependencies before installing (defaults: false)"

environment="dev"
lando=false
install=false
refresh=false
while getopts ':hpliff:' option; do
  case "$option" in
    h) echo "$usage"
       exit
       ;;
    p) environment="prod"
       ;;
    l) lando=true
       ;;
    f) refresh=true
       ;;
    i) install=true
       ;;
    :) printf "missing argument for -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
   \?) printf "illegal option: -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
  esac
done

if ${lando}
then
   pre="lando"
else
   pre=""
fi

echo "Running setup for ${environment} environment"

read -r -p "Do you want to continue? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    echo "Continuing..."
else
   echo "Ending execution"
   exit
fi


cd vendor/opendialogai/webchat

if (${refresh})
then
    echo "Refreshing local dependencies"
    rm -rf node_modules/vue-beautiful-chat
fi


if (${install})
then
    echo "Installing node dependencies"
    eval ${pre} npm install
fi

echo "Running ${pre} npm run"
eval ${pre} npm run ${environment}

cd ../../../

echo "Deleting local public files"
rm -r public/vendor/webchat

eval ${pre} php artisan vendor:publish --tag=public --force

eval ${pre} php artisan vendor:publish --tag=vue-components --force

echo "Updating JS and CSS version string"

rand=$(date +%s)

sed -i -e "s/JS_VERSION=.*/JS_VERSION=$rand/g" .env

sed -i -e "s/CSS_VERSION=.*/CSS_VERSION=$rand/g" .env

echo "Updates finished"