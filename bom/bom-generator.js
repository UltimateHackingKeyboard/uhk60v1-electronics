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

var components = [];
bomFiles.forEach(function(bomFile) {
    var kicadComponents = fs.readFileSync(bomFile.components, {encoding:'utf8'});
    var kicadNetlist = fs.readFileSync(bomFile.netlist, {encoding:'utf8'});
    var newComponents = kicadBomGenerator(kicadComponents, kicadNetlist);
    newComponents.forEach(function(newComponent) {
        newComponent.file = bomFile.name;
    });
    components = components.concat(newComponents);
});

components = components.map(function(component) {
    var type = R.uniq([component.libsource.part, component.value, component.component.module]).join(' ');
    return {
        type: type,
        reference: component.ref,
        file: component.file
    };
});

var componentTypes = R.uniq(components.map(R.prop('type'))).sort();

//console.log(JSON.stringify(components, null, 4));
console.log(JSON.stringify(componentTypes, null, 4));
