#!/usr/bin/env node

var execSync = require('exec-sync');
var fs = require('fs');
var util = require('util');

var layerFilenameSuffixes = [
    '-B_Cu.gbl',
    '-B_Mask.gbs',
    '-B_SilkS.gbo',
    '.drl',
    '-Edge_Cuts.gbr',
    '-F_Cu.gtl',
    '-F_Mask.gts',
    '-F_SilkS.gto',
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
    'connector': [
        [3.6, 2.1],
        [3.6, 2.4],
        [0, 2.1],
        [0, 2.4],
        [9.5, 2.1],
        [9.5, 2.4]
    ]
};

var outputDirectory = 'merged';

layerFilenameSuffixes.forEach(function(layerFilenameSuffix) {
    gerbvCommand = util.format('gerbv --export=rs274x --output=%s/%s%s', outputDirectory, outputDirectory, layerFilenameSuffix);
    for (gerber in gerbers) {
        gerberCoordinates = gerbers[gerber];
        gerberCoordinates.forEach(function(coordinate) {
            var filename = util.format('%s/%s%s', gerber, gerber, layerFilenameSuffix);
            if (fs.existsSync(filename)) {
                gerbvCommand += util.format(' -T%d,%d %s', coordinate[0], coordinate[1], filename);
            }
        });
    }
    console.log(gerbvCommand);
    execSync(gerbvCommand);
});
