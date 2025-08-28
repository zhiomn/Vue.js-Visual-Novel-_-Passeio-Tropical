import { parseXState, parsePiniaStore } from './parser.js';
import { renderGraph } from './renderer.js';

const fileInput = document.getElementById('file-input');
const container = document.getElementById('diagram-container');

const diagramIndex = {};
const fileContents = {};

async function parseAndIndexFile(file) {
    const content = await file.text();
    fileContents[file.name] = content;
    
    let graphData;
    let parserType;

    if (content.includes('createMachine')) {
        parserType = 'xstate';
        graphData = parseXState(content);
    } else if (content.includes('defineStore')) {
        parserType = 'pinia';
        graphData = parsePiniaStore(content);
    } else {
        return;
    }

    graphData.nodes.forEach(node => {
        diagramIndex[node.id] = {
            filePath: file.name,
            nodeId: node.id,
            type: parserType
        };
    });
}

async function loadAndRenderDiagram(fileName, nodeIdToHighlight) {
    const content = fileContents[fileName];
    if (!content) return;
    
    let graphData;
    if (content.includes('createMachine')) {
        graphData = parseXState(content);
    } else if (content.includes('defineStore')) {
        graphData = parsePiniaStore(content);
    }
    
    await renderGraph(graphData, diagramIndex, nodeIdToHighlight);
}

window.loadAndRenderDiagram = loadAndRenderDiagram;

fileInput.addEventListener('change', async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Object.keys(diagramIndex).forEach(key => delete diagramIndex[key]);
    Object.keys(fileContents).forEach(key => delete fileContents[key]);
    container.innerHTML = '<p class="placeholder-text">Processando arquivos...</p>';

    for (const file of files) {
        await parseAndIndexFile(file);
    }
    
    console.log("Índice de Diagramas Construído:", diagramIndex);

    if (files.length > 0) {
       await loadAndRenderDiagram(files[0].name);
    }
});
