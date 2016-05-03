#!/usr/bin/env node

var execSync = require('child_process').execSync;
var fs = require('fs');
var util = require('util');

var layerFilenameSuffixes = [
    '-B.Cu.gbl',
    '-B.Mask.gbs',
    '-B.SilkS.gbo',
    '.drl',
    '-Edge.Cuts.gm1',
    '-F.Cu.gtl',
    '-F.Mask.gts',
    '-F.SilkS.gto',
    '-NPTH.drl'
];

var gerbers = {
    'left-main': [
        [0, 0]
    ],
    'right-main': [
        [5.7, -0.065]
    ],
    'display': [
        [5.4, 2.4],
        [8.5, 2.4]
    ],
    'connectors': [
        [3.6, 2.1],
        [3.6, 2.4],
        [0, 2.1],
        [0, 2.4],
        [9.5, 2.1],
        [9.5, 2.4]
    ]
};

var outputDirectory = 'merged';

function sanitizeGerberFileIfNeeded(gerberFilename) {
    var gerberContent = fs.readFileSync(gerberFilename, {encoding:'utf8'});
    var gerberLines = gerberContent.split('\n').filter(function(gerberLine) {
        return gerberLine.length > 0;
    });

    if (!(gerberLines.indexOf('%LPC*%') !== -1 && gerberLines.indexOf('%LPD*%') === -1)) {
        return;
    }

    gerberLines.splice(-1, 0, '%LPD*%');
    gerberContent = gerberLines.join('\n') + '\n';
    fs.writeFileSync(gerberFilename, gerberContent);
    console.log('Sanitized', gerberFilename);
}

layerFilenameSuffixes.forEach(function(layerFilenameSuffix) {
    var gerbvCommand = util.format('gerbv --export=rs274x --output=%s/%s%s', outputDirectory, outputDirectory, layerFilenameSuffix);
    for (gerber in gerbers) {
        gerberCoordinates = gerbers[gerber];
        gerberCoordinates.forEach(function(coordinate) {
            var filename = util.format('%s/%s%s', gerber, gerber, layerFilenameSuffix);
            console.log(filename)
            if (fs.existsSync(filename)) {
                sanitizeGerberFileIfNeeded(filename);
                gerbvCommand += util.format(' -T%d,%d %s', coordinate[0], coordinate[1], filename);
            }
        });
    }
    console.log(gerbvCommand);
    execSync(gerbvCommand);
});
