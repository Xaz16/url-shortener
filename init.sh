#!/bin/bash

if [[ -z "$(ls -A $PWD | grep .env)" ]]; then
	echo "no .env file found."
	exit 1
fi

npm install

source .env

if [[ "$NODE_ENV" == "production" ]]; then
	adonis serve --polling
else
	adonis serve --dev --polling
fi
