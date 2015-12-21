#!/usr/bin/env bash

echo "Adding repos"
sudo add-apt-repository --yes ppa:js-reynaud/kicad-4
sudo add-apt-repository --yes ppa:saiarcot895/myppa
echo "Running apt-get update"
sudo apt-get update -qq