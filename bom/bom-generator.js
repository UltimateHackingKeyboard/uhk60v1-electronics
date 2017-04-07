#!/usr/bin/env node

let fs = require('fs');
let path = require('path');
let R = require('ramda');
let parseCsv = require('babyparse').parse;

let boards = ['left-main', 'right-main', 'display'];
let attributes = ['all', 'smd', 'pth'];

componentTypesFile = 'UHK BOM - Component types.csv';

function reportFileToParts(reportFilename) {
    let reportString = fs.readFileSync(reportFilename, {encoding:'utf8'});
    let boardName = path.basename(reportFilename).replace(/\.[^/.]+$/, '');

    let parts= reportString
        .split('$EndMODULE')
        .map(componentString => {
            let component = {};
            componentString.split('\n')
                .map(componentLine => componentLine.match(/^(\w+) (.*)$/))
                .filter(matchedComponentPatterns =>
                    matchedComponentPatterns && matchedComponentPatterns.length === 3
                )
                .forEach(matchedComponentPatterns => {
                    let componentAttributeName = matchedComponentPatterns[1];
                    componentAttributeName = {
                        reference: 'reference',
                        value: 'value',
                        footprint: 'footprint',
                        attribut: 'attribute'
                    }[componentAttributeName];

                    let componentAttributeValue = matchedComponentPatterns[2];
                    let componentAttributeValuePatterns = componentAttributeValue.match(/^"(.*)"$/);
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
    return array.map(element => {
        if (element === undefined) {
            return '';
        } else {
            return '"' + element.toString().replace(/"/g, '\\"') + '"';
        }
    }).join(',');
}

function partsToCsvFile(parts, csvFilename) {
    let csvFileContent = parts
        .map(part => [part.reference, part.value, part.footprint, part.attribute])
        .map(arrayToCsv).join('\n');
    fs.writeFileSync(csvFilename, csvFileContent);
}

let referenceDesignatorRegExp = /^([A-Z]+)(\d+)$/;

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

    let matches = part.reference.match(referenceDesignatorRegExp);

    if (!(matches && matches.length === 3)) {
        return;
    }

    part.referenceName = matches[1];
    part.referenceNumber = matches[2];

    if (R.contains(part.referenceName, ['P', 'SW'])) {
        part.value = '';
    }

    part.partType = partToPartType(part);
}

function partToPartType(part) {
    return part.referenceName + ':' + part.value + ':' + part.footprint;
}

function partsToPartTypes(parts) {
    return R.uniq(parts.map(R.prop('partType')));
}

function extractReferenceDesignator(referenceDesignator) {
    let extractedReferenceDesignator = referenceDesignator.match(referenceDesignatorRegExp);
    if (!extractedReferenceDesignator) {
        throw new Error(`Invalid reference designator: ${referenceDesignator}`);
    }
    return extractedReferenceDesignator;
}

function sortReferenceDesignators(referenceDesignators) {
    return referenceDesignators.sort((a, b) => {
        let aMatch = extractReferenceDesignator(a);
        let bMatch = extractReferenceDesignator(b);
        let aLetter = aMatch[1];
        let bLetter = bMatch[1];
        let aNumber = parseInt(aMatch[2]);
        let bNumber = parseInt(bMatch[2]);

        if (aLetter < bLetter) {
            return -1;
        } else if (aLetter < bLetter) {
            return 1;
        } else {
            return aNumber < bNumber ? -1 : 1;
        }
    });
}

// Construct optional component types data structure.

let componentTypes = {};

try {
    let componentTypesCsv = fs.readFileSync(componentTypesFile, 'utf8');
    let componentTypesArray = parseCsv(componentTypesCsv, {delimiter:'"'}).data;

    let componentTypesHeader = componentTypesArray.shift();

    componentTypesArray.forEach(componentTypeArray => {
        if (!componentTypeArray[0]) {
            return;
        }
        let componentType = {};
        let fieldIndex = 0;
        componentTypeArray.forEach(componentTypeField => {
            componentType[componentTypesHeader[fieldIndex++]] = componentTypeField;
        });
        componentTypes[componentType.partType] = componentType;
    });
} catch (exception) {

}
// Read parts from report files.

let allParts = [];

boards.forEach(board => {
    let reportFile = __dirname + '/../' + board + '/' + board + '.rpt';
    let parts = reportFileToParts(reportFile);
    parts.forEach(normalizePartProperties);
    parts = R.reject(R.propEq('attribute', 'virtual'), parts);
    allParts = allParts.concat(parts);
});

// Extract part types.

let partTypes = R.uniq(allParts.map(R.prop('partType')));
partTypes = partTypes.map(partType => {
    let filteredParts = allParts.filter(R.where({partType:partType}));
    let firstPart = filteredParts[0];
    return {
        partType: partType,
        quantity: filteredParts.length,
        partsPerBoard: {
            leftMain: filteredParts.filter(R.where({board:'left-main'})).map(R.prop('reference')),
            rightMain: filteredParts.filter(R.where({board:'right-main'})).map(R.prop('reference')),
            display: filteredParts.filter(R.where({board:'display'})).map(R.prop('reference'))
        },
        referenceName: firstPart.referenceName,
        value: firstPart.value,
        footprint: firstPart.footprint,
        attribute: {smd:'smd', none:'pth'}[firstPart.attribute] || 'n/a'
    };
})

// Sort part types.

partTypes.sort((partTypeA, partTypeB) => {
    if (partTypeA.referenceName < partTypeB.referenceName) {
        return -1;
    } else if (partTypeA.referenceName > partTypeB.referenceName) {
        return 1;
    } else {
        if (partTypeA.value < partTypeB.value) {
            return -1;
        } else if (partTypeA.value > partTypeB.value) {
            return 1;
        } else {
            return partTypeA.footprint < partTypeB.footprint ? -1 : 1;
        }
    }
});

// Generate per-board BOMs.

boards.forEach(board => {
    attributes.forEach(attribute => {
        let camelCasedBoard = board.replace(/-([a-z])/g, g => g[1].toUpperCase());
        fs.writeFileSync(
            board + '-' + attribute + '-bom.csv',
            [[
                'part code',
                'QTY',
                'description',
                'package',
                'reference designators',
                'AVL1',
                'AVL1 P/N'
            ]].concat(
                partTypes
                .filter(partType =>
                    partType.partsPerBoard[camelCasedBoard].length > 0 &&
                        (attribute == 'all' ? true : partType.attribute == attribute)
                )
                .map(partType => {
                    let componentType = componentTypes[partType.partType] || {};
                    return arrayToCsv([
                        partType.partType,
                        partType.partsPerBoard[camelCasedBoard].length,
                        componentType.description,
                        componentType.package,
                        sortReferenceDesignators(partType.partsPerBoard[camelCasedBoard]).join(','),
                        componentType.avl1,
                        componentType.avl1pn
                    ]);
                })
            ).join('\n')
        );
    });
});

// Generate BOMs including every board.

['all', 'smd', 'pth'].forEach(attributeFilter => {
    fs.writeFileSync(
        'boards-' + attributeFilter + '-bom.csv',
        [[
            'part code',
            'description',
            'package',
            'left main QTY',
            'left main reference designators',
            'right main QTY',
            'right main reference designators',
            'display QTY',
            'display reference designators',
            'QTY SUM',
            'AVL1',
            'AVL1 P/N',
            'AVL1 URL',
            'price per part',
            'price SUM'
        ]].concat(
            partTypes
            .filter(partType => attributeFilter == 'all' ? true : partType.attribute == attributeFilter)
            .map(partType => {
                let componentType = componentTypes[partType.partType] || {};
                return arrayToCsv([
                    partType.partType,
                    componentType.description,
                    componentType.package,
                    partType.partsPerBoard.leftMain.length,
                    sortReferenceDesignators(partType.partsPerBoard.leftMain).join(','),
                    partType.partsPerBoard.rightMain.length,
                    sortReferenceDesignators(partType.partsPerBoard.rightMain).join(','),
                    partType.partsPerBoard.display.length,
                    sortReferenceDesignators(partType.partsPerBoard.display).join(','),
                    partType.quantity,
                    componentType.avl1,
                    componentType.avl1pn,
                    componentType.avl1url,
                    componentType.price,
                    componentType.price * partType.quantity
                ]);
            })
        ).join('\n')
    );
});
