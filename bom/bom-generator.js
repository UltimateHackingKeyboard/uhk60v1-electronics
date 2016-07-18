#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var R = require('ramda');

reportFileToParts = function(reportFilename) {
    var reportString = fs.readFileSync(reportFilename, {encoding:'utf8'})
    var boardName = path.basename(reportFilename).replace(/\.[^/.]+$/, '');

    return reportString
        .split('$EndMODULE')
        .map(function(componentString) {
            var component = {};
            componentString.split('\n')
                .map(function(componentLine) {
                    return componentLine.match(/^(\w+) (.*)$/);
                })
                .filter(function(matchedComponentPatterns) {
                    return matchedComponentPatterns && matchedComponentPatterns.length === 3;
                })
                .forEach(function(matchedComponentPatterns) {
                    var componentAttributeName = matchedComponentPatterns[1];
                    componentAttributeName = {
                        reference: 'reference',
                        value: 'value',
                        footprint: 'footprint',
                        attribut: 'attribute'
                    }[componentAttributeName];

                    var componentAttributeValue = matchedComponentPatterns[2];
                    var componentAttributeValuePatterns = componentAttributeValue.match(/^"(.*)"$/);
                    if (componentAttributeValuePatterns && componentAttributeValuePatterns.length === 2) {
                        componentAttributeValue = componentAttributeValuePatterns[1]
                    }

                    component[componentAttributeName] = componentAttributeValue;
                });

                component.board = boardName;
                delete component.undefined;
                return component;
        })
};

var reportFiles = [
    __dirname + '/../left-main/left-main.rpt',
    __dirname + '/../right-main/right-main.rpt',
    __dirname + '/../display/display.rpt'
];

var parts = reportFileToParts(reportFiles[0]);
parts = R.reject(R.propEq('attribute', 'virtual'), parts);
console.log(parts)
return;

var components = [];
reportFiles.forEach(function(bomFile) {
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

var componentsStatistics = componentTypes.map(function(componentType) {
    return [
        componentType,
        components.filter(R.propEq('type', componentType)).length,
        components.filter(R.where({type:componentType, file:'left-main'})).length,
        components.filter(R.where({type:componentType, file:'right-main'})).length,
        components.filter(R.where({type:componentType, file:'display'})).length
    ];
});

var componentStatisticsCsv = componentsStatistics.map(function(componentStatistic) {
    return componentStatistic.join(',');
}).join('\n');

fs.writeFileSync(__dirname + '/bom.csv', componentStatisticsCsv);
