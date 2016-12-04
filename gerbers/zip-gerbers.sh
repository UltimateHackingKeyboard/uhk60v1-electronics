#!/bin/bash

for directory in connectors display left-main right-main panel; do
    rm -f $directory.zip
    zip --recurse-paths $directory.zip $directory
done
