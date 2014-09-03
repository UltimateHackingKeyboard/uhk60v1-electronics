#!/bin/bash

for directory in connector display left-main right-main; do
    rm -f $directory.zip
    zip --recurse-paths $directory.zip $directory
done
