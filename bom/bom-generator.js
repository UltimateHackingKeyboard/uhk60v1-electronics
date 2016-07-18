#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var R = require('ramda');

var reportFiles = [
    __dirname + '/../left-main/left-main.rpt',
    __dirname + '/../right-main/right-main.rpt',
    __dirname + '/../display/display.rpt'
];

function reportFileToParts(reportFilename) {
    var reportString = fs.readFileSync(reportFilename, {encoding:'utf8'});
    var boardName = path.basename(reportFilename).replace(/\.[^/.]+$/, '');

    var parts= reportString
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
                        componentAttributeValue = componentAttributeValuePatterns[1];
                    }

                    component[componentAttributeName] = componentAttributeValue;
                });

                component.board = boardName;
                delete component.undefined;
                return component;
        })
    parts.pop(); // Remove last undefined element.
    return parts;
};

function filepathToBoardname(filename) {
    return path.basename(filename).replace(/\.[^/.]+$/, '');
}

function arrayToCsv(array) {
    return array.map(function(element) {
        return '"' + element.replace(/"/g, '\\"') + '"';
    }).join(',');
}

function partsToCsvFile(parts, csvFilename) {
    var csvFileContent = parts
        .map(function(part) {
            return [part.reference, part.value, part.footprint, part.attribute];
        })
        .map(arrayToCsv).join('\n');
    fs.writeFileSync(csvFilename, csvFileContent);
}

function normalizePartProperties(part) {
    if (part.value === 'FIDUCIAL') {
        part.attribute = 'virtual';
    }

    if (part.footprint.indexOf('UGL:Cherry_MX_LED_') === 0) {
        part.footprint = 'UGL:Cherry_MX_LED';
    }

    if (part.footprint.indexOf('UGL:Cherry_MX_Matias_Hybrid_') === 0) {
        part.footprint = 'UGL:Cherry_MX_Matias_Hybrid';
    }

    var matches = part.reference.match(/^([A-Z]+)(\d+)$/);

    if (!(matches && matches.length === 3)) {
        return;
    }

    part.referenceName = matches[1];
    part.referenceNumber = matches[2];

    if (R.contains(part.referenceName, ['P', 'SW'])) {
        part.value = '';
    }

    part.groupId = partToGroupId(part);
}

function partToGroupId(part) {
    return part.referenceName + ':' + part.value + ':' + part.footprint;
}

function partsToGroupIds(parts) {
    return R.uniq(parts.map(R.prop('groupId')));
}

reportFiles.forEach(function(reportFile) {
    var parts = reportFileToParts(reportFile);
    parts.forEach(normalizePartProperties);
    parts = R.reject(R.propEq('attribute', 'virtual'), parts);
    console.log(partsToGroupIds(parts))
    partsToCsvFile(parts, filepathToBoardname(reportFile) + '.csv');
});

return;

var components = [];
components = components.concat(newComponents);

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
