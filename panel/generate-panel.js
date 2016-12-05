#!/usr/bin/env node

let fs = require('fs');

function parseKicadPcbFile(kicadPcbFilename, getHeader=false, deltaX=0, deltaY=0) {

    function writeResultLines(resultLines) {
        // Rename all nets to net 1 GND in order to prevent net reference errors.
        console.log(resultLines.join('\n')
                               .replace(/\(net [0-9]+ ".+"\)/g, '(net 1 GND)')
                               .replace(/\(net [0-9]+ [^)]+\)/g, '(net 1 GND)')
                               .replace(/\(net [0-9]+\)/g, '(net 1)'));
    }

    let content = fs.readFileSync(kicadPcbFilename, {encoding:'utf8'});
    let lines = content.split('\n');
    let resultLines = [];
    let resultLinesEmptied = false;
    let moduleStateCounter = 0;
    let regexp = /\((at|start|end|center|xy) (-?[0-9.]+) (-?[0-9.]+)( -?[0-9.]+)?\)/g;

    for (line of lines) {
        if (line.match(/^  \(module /)) {
            if (getHeader) {
                writeResultLines(resultLines);
                return;
            } else if (!resultLinesEmptied) {
                resultLines = [];
                resultLinesEmptied = true;
            }
            moduleStateCounter = 1;
        }
        if (moduleStateCounter && line === '  )') {
            moduleStateCounter = 0;
        }

        line = line.replace(regexp, ((match) => {
            if (moduleStateCounter) {
                moduleStateCounter++;
            }

            return match.replace(regexp, (match2, command, x, y, misc) => {
                let calculatedX = parseFloat(x) + (moduleStateCounter>2 ? 0 : deltaX);
                let calculatedY = parseFloat(y) + (moduleStateCounter>2 ? 0 : deltaY);
                return `(${command} ${calculatedX} ${calculatedY}${misc ? ' '+misc : ''})`;
            })
        }));
        resultLines.push(line)
    };

    // Remove last parenthesis.
    resultLines.pop();
    resultLines.pop();

    writeResultLines(resultLines);
}

function writeHeader(kicadPcbFilename) {
    return parseKicadPcbFile(kicadPcbFilename, getHeader=true);
}

function writeContent(kicadPcbFilename, deltaX=0, deltaY=0) {
    return parseKicadPcbFile(kicadPcbFilename, false, deltaX=deltaX, deltaY=deltaY);
}

function writeFooter() {
    console.log(')\n');
}

writeHeader('empty-panel.kicad_pcb');
writeContent('../left-main/left-main.kicad_pcb', -60, 38.979783);
writeContent('../right-main/right-main.kicad_pcb', 80.02, 40);
writeContent('../display/display.kicad_pcb', -40, -25);
writeContent('../display/display.kicad_pcb', 170, -25);
writeContent('../connectors/connectors.kicad_pcb', 70, -30);
writeFooter();
