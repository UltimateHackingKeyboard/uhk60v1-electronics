#!/usr/bin/env node

let fs = require('fs');
let path = require('path');

function extractTestPoints(filename) {
    let fileContent = fs.readFileSync(filename, {encoding:'utf8'});
    let referenceDesignator;
    let testPoints = [];
    let isInsideTestPoint = false;

    fileContent
    .split('\n')
    .forEach((line) => {
        let matches = line.match(/^\$MODULE \"TP_(.+)"/);
        if (matches) {
            referenceDesignator = matches[1];
            isInsideTestPoint = true;
        }
        matches = line.match(/^position ([0-9-.]+) ([0-9-.]+) /);
        if (matches && isInsideTestPoint) {
            testPoints.push({
                referenceDesignator: referenceDesignator,
                x: +matches[1],
                y: +matches[2]
            });
            isInsideTestPoint = false;
        }
    })

    return testPoints;
};

function computeTestPointDistances(testPoints) {
    let distances = [];
    let i = 0;
    testPoints.forEach(testPoint1 => {
        testPoints.slice(++i, testPoints.length).forEach(testPoint2 => {
            distances.push({
                points: `${testPoint1.referenceDesignator} - ${testPoint2.referenceDesignator}`,
                distance: Math.sqrt(Math.pow(testPoint1.x-testPoint2.x, 2) + Math.pow(testPoint1.y-testPoint2.y, 2))
            });
        })
    })
    return distances;
};

['../left-main/left-main.rpt', '../right-main/right-main.rpt', '../display/display.rpt'].forEach(filename => {
    let testPoints = extractTestPoints(filename);
    let testPointDistances = computeTestPointDistances(testPoints);
    testPointDistances.sort((a, b) => a.distance < b.distance ? -1 : 1);
    fs.writeFileSync(
        path.basename(filename).replace(/\.[^/.]+$/, '') + '.txt',
        testPointDistances.map(testPointDistance => `${testPointDistance.points}: ${testPointDistance.distance}`).join('\n'));
})
