import { processMarkdown } from './parser.js';

const sequences = [
    { name: 'Sequência V3 (Roteiro)', file: 'sequence-complete-v3.md', category: 'Sequências de Eventos', icon: 'fa-solid fa-drafting-compass' },
    
    { name: 'Fluxo de Progressão (Mermaid)', file: '../diagrams/progression-flow-mermaid.html', category: 'Diagramas de Arquitetura', icon: 'fa-solid fa-diagram-project', isExternal: true },
    { name: 'Fluxo de Progressão (FlowJS)', file: '../diagrams/progression-flow-flowjs.html', category: 'Diagramas de Arquitetura', icon: 'fa-solid fa-diagram-project', isExternal: true },
    { name: 'Fluxo Causal (Mermaid)', file: '../diagrams/causal-unlocks-mermaid.html', category: 'Diagramas de Arquitetura', icon: 'fa-solid fa-diagram-project', isExternal: true },
    { name: 'Fluxo Causal (FlowJS)', file: '../diagrams/causal-unlocks-flowjs.html', category: 'Diagramas de Arquitetura', icon: 'fa-solid fa-diagram-project', isExternal: true },
    
    { name: 'Guia de Sintaxe', file: '_glossary.md', category: 'Documentação', icon: 'fa-solid fa-book' }
];

const catalogFiles = [
    'parts/_catalog-trigger.json',
    'parts/_catalog-logic.json',
    'parts/_catalog-system.json',
    'parts/_catalog-ui.json',
    'parts/_catalog-audio.json'
];

async function loadAndConsolidateCatalogs() {
    const promises = catalogFiles.map(file => fetch(file).then(res => res.json()));
    const catalogs = await Promise.all(promises);
    const actionMap = new Map();
    catalogs.forEach((catalog, index) => {
        const category = catalogFiles[index].match(/_catalog-(.*?).json/)[1].toUpperCase();
        catalog.forEach(action => {
            action.category = category;
            actionMap.set(action.id, action);
        });
    });
    return actionMap;
}

export function getSequences() {
    return sequences;
}

export async function fetchAndParseMarkdown(filePath) {
    try {
        const actionCatalog = await loadAndConsolidateCatalogs();
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
        const markdownText = await response.text();

        document.body.classList.remove('layout-document');
        const existingDocLink = document.querySelector('link[href="css/layout-document.css"]');
        if (existingDocLink) existingDocLink.remove();

        if (filePath.includes('_glossary')) {
            document.body.classList.add('layout-document');
            const link = document.createElement('link');
            link.rel = 'stylesheet'; link.href = 'css/layout-document.css';
            document.head.appendChild(link);
            return marked.parse(markdownText);
        }
        
        return processMarkdown(markdownText, actionCatalog);

    } catch (error) {
        console.error(error);
        return `<p class="error">Não foi possível carregar o conteúdo. Erro: ${error.message}</p>`;
    }
}
