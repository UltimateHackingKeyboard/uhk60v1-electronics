Ultimate Hacking Keyboard electronics
=====================================

Contained are the schematics and board layout [KiCad](http://kicad-pcb.org/) files for the Ultimate Hacking Keyboard.

## Installation


Install KiCad from [kicad-pdb.org](http://kicad-pcb.org/)

Install KiCad [extras](http://kicad-pcb.org/download/)

Then install the following two libraries

- [ugl-kicad-libs](https://code.google.com/p/opendous/downloads/detail?name=KiCad_Libraries-2012-10-18.zip&can=2&q=)

- [Opendous](https://code.google.com/p/opendous/downloads/detail?name=KiCad_Libraries-2012-10-18.zip&can=2&q=)

### ugl-kicad-libs installation

Either download the zip, or clone the git repository

    git clone https://github.com/UltimateHackingKeyboard/ugl-kicad-libs
    
Then inside kicad go to "component Libraries"

![](http://cl.ly/3d1y0u2d1X2V/Screen%20Shot%202015-12-12%20at%209.17.23%20PM.png)

And add a relative or absolute path to the library directory


![](http://cl.ly/122b3a3E1F0W/Screen%20Shot%202015-12-12%20at%209.15.56%20PM.png)


## Opendous installation

The opendous download has two folders

- library
- modules

Copy the contents of the library folder to the kicad library directory. 

e.g. on OSX the library path is `/Library/Application\ Support/kicad/library/`

Copy the cotents of the modules folder to a **new folder** in the kicad module directory


e.g. on OSX the module path is `/Library/Application\ Support/kicad/modules/opendous`

# Known issues

OSX Users may get a warning that the 'special' library is missing. This is most likely a harmless error. 

![](http://cl.ly/122o2a1H1Y2a/Screen%20Shot%202015-12-12%20at%207.48.11%20PM.png)