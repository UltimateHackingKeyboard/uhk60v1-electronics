#!/usr/bin/env bash

echo "Installing packages"
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y apt-fast #http://serverfault.com/q/227190/169180
sudo apt-fast install -y kicad git imagemagick curl poppler-utils
