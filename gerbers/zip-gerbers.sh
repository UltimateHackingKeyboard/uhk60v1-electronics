#!/bin/bash

for directory in connector display left-main right-main; do
    zip --recurse-paths $directory.zip $directory
done
