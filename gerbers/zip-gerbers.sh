#!/bin/bash

for directory in connector display left-main right-main; do
    zip -r $directory.zip $directory
done
