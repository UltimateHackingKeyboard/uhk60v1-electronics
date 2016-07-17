#!/usr/bin/env node

var fs = require('fs');
var R = require('ramda');

reportStringToParts = function(reportString) {
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
                .map(function(matchedComponentPatterns) {
                    var componentAttributeName = matchedComponentPatterns[1];
                    var componentAttributeValue = matchedComponentPatterns[2];

                    // Update the name of the property
                    matchedComponentPatterns[1] = {
                        reference: 'reference',
                        value: 'value',
                        footprint: 'footprint',
                        attribut: 'attribute'
                    }[componentAttributeName];

                    // Update the value of the property
                    var componentAttributeValuePatterns = componentAttributeValue.match(/^"(.*)"$/);
                    if (componentAttributeValuePatterns && componentAttributeValuePatterns.length === 2) {
                        matchedComponentPatterns[2] = componentAttributeValuePatterns[1]
                    }
                    return matchedComponentPatterns;
                })
                .forEach(function(matchedFilteredComponentPatterns) {
                    component[matchedFilteredComponentPatterns[1]] = matchedFilteredComponentPatterns[2];
                });
                delete component.undefined;
                return component;
        })
};

var reportFiles = [
    {
        name: 'left-main',
        file: __dirname + '/../left-main/left-main.rpt',
    },
    {
        name: 'right-main',
        file: __dirname + '/../right-main/right-main.rpt',
    },
    {
        name: 'display',
        file: __dirname + '/../display/display.rpt',
    }
];

var reportString = fs.readFileSync(reportFiles[0].file, {encoding:'utf8'});
var parts = reportStringToParts(reportString);
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
