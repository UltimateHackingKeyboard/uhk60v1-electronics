#!/usr/bin/env python

# Python script that ensures pcbnew python module is installed
# Without this script, problems with travis-ci would only be detected on git
# commits that includ changed kicad files. With this script, regressions can be
# detecte with every commit.

# If module is not installed, you will get the following error
# Traceback (most recent call last):
#  File "test/travis/flight-test.py", line 4, in <module>
#    from pcbnew import *
# ImportError: No module named pcbnew

import sys
from pcbnew import *
print "pcbnew python module is present on system"
sys.exit(0)