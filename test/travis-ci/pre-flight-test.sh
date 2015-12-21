#!/usr/bin/env bash
set -ev

# Ensure poppler-utils is installed (required for pdf convert)
pdftoppm -v

# Ensure imagemagick is installed
convert -version

# Ensure kicad4 package and pcbnew python module is installed
sudo python ./test/travis-ci/pre-flight-test.py