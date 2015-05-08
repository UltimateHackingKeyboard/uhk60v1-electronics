#!/usr/bin/env node

var fs = require('fs');
var R = require('ramda');
var kicadBomGenerator = require('kicad-bom-generator');

var bomFiles = [
    {
        name: 'left-main',
        netlist: __dirname + '/../left-main/left-main.net',
        components: __dirname + '/../left-main/left-main.cmp'
    },
    {
        name: 'left-main',
        netlist: __dirname + '/../right-main/right-main.net',
        components: __dirname + '/../right-main/right-main.cmp'
    },
    {
        name: 'display',
        netlist: __dirname + '/../display/display.net',
        components: __dirname + '/../display/display.cmp'
    }
];

function generateBomFromFiles(componentFilename, netlistFilename) {
    var kicadComponents = fs.readFileSync(componentFilename, {encoding:'utf8'});
    var kicadNetlist = fs.readFileSync(netlistFilename, {encoding:'utf8'});
    return kicadBomGenerator(kicadComponents, kicadNetlist);
}

var components = [];
bomFiles.forEach(function(bomFile) {
    var newComponents = generateBomFromFiles(bomFile.components, bomFile.netlist);
    newComponents.forEach(function(newComponent) {
        newComponent.file = bomFile.name;
    });
    components = components.concat(newComponents);
});

components = components.map(function(component) {
    var name = R.uniq([component.libsource.part, component.value, component.component.module]).join(' ');
    return {
        name: name,
        reference: component.ref,
        file: component.file
    };
});

console.log(JSON.stringify(components, null, 4));
