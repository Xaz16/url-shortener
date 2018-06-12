#!/usr/bin/env bash

crontab -r

#write out current crontab
crontab -l > mycron

#echo new cron into cron file
echo "0 4 * * * node ~/Development/self-projects/url-shortener ace clear:old:entry >> /dev/null 2>&1" >> mycron

#install new cron file
crontab mycron

rm mycron
