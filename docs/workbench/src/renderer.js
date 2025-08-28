const elk = new ELK();
const inspectorPanel = document.getElementById('inspector-panel');
const container = document.getElementById('diagram-container');

function showInspectorForNode(nodeData, diagramIndex) {
    if (!nodeData) {
        inspectorPanel.innerHTML = '<div class="placeholder-text">Clique em um nó para ver seus detalhes e referências.</div>';
        return;
    }
    
    let referencesHtml = '';
    if (nodeData.references && nodeData.references.length > 0) {
        referencesHtml += '<h3 class="inspector-subtitle">Referências Cruzadas</h3><ul class="inspector-references">';
        nodeData.references.forEach(ref => {
            if (diagramIndex[ref]) {
                const { filePath, nodeId } = diagramIndex[ref];
                referencesHtml += `<li><a href="#" onclick="window.loadAndRenderDiagram('${filePath}', '${nodeId}'); return false;">${ref}</a></li>`;
            } else {
                 referencesHtml += `<li><a href="#" class="disabled">${ref} (não encontrado)</a></li>`;
            }
        });
        referencesHtml += '</ul>';
    }

    inspectorPanel.innerHTML = `
        <h2 class="inspector-title">${nodeData.label}</h2>
        <h3 class="inspector-subtitle">Node Type</h3>
        <p>${nodeData.type}</p>
        ${referencesHtml}
        <h3 class="inspector-subtitle">Source Code</h3>
        <pre class="inspector-code">${nodeData.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    `;
}

export async function renderGraph(graphData, diagramIndex, highlightNodeId) {
    const graph = {
        id: 'root',
        layoutOptions: {
            'elk.algorithm': 'layered', 'elk.direction': 'DOWN',
            'elk.spacing.nodeNode': '50', 'elk.layered.spacing.nodeNodeBetweenLayers': '60'
        },
        children: graphData.nodes.map(node => ({ ...node })),
        edges: graphData.edges.map(edge => ({ ...edge }))
    };

    const layout = await elk.layout(graph);
    
    container.innerHTML = '';
    
    const svg = d3.select(container).append("svg")
        .attr("width", '100%')
        .attr("height", '100%');
    
    const svgGroup = svg.append("g");

    const zoom = d3.zoom().scaleExtent([0.1, 4]).on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
    });
    svg.call(zoom);

    svgGroup.append("defs").append("marker")
        .attr("id", "arrow").attr("viewBox", "0 -5 10 10").attr("refX", 10).attr("refY", 0)
        .attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto")
        .append("path").attr("d", "M0,-5L10,0L0,5");

    svgGroup.append("g").attr("class", "edges").selectAll("path").data(layout.edges).enter().append("path")
        .attr("class", d => `edge type-${d.label.toLowerCase().replace(/\s/g, '-')}`)
        .attr("d", d => {
            let path = `M ${d.sections[0].startPoint.x} ${d.sections[0].startPoint.y}`;
            d.sections[0].bendPoints?.forEach(bp => path += ` L ${bp.x} ${bp.y}`);
            path += ` L ${d.sections[0].endPoint.x} ${d.sections[0].endPoint.y}`;
            return path;
        }).attr("marker-end", "url(#arrow)");
        
    svgGroup.append("g").attr("class", "edge-labels").selectAll("text")
        .data(layout.edges.filter(e => e.labels && e.labels.length > 0)).enter().append("text")
        .attr("class", "edge-label").attr("x", d => d.labels[0].x).attr("y", d => d.labels[0].y)
        .attr("text-anchor", "middle").text(d => d.labels[0].text);

    const nodes = svgGroup.append("g").attr("class", "nodes").selectAll("g")
        .data(layout.children).enter().append("g")
        .attr("class", d => `node type-${d.type} ${d.isFinal ? 'final' : ''}`)
        .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .on("click", (event, d) => {
            d3.selectAll('.node.highlight').classed('highlight', false);
            d3.select(event.currentTarget).classed('highlight', true);
            showInspectorForNode(d, diagramIndex);
        });

    nodes.append("rect").attr("width", d => d.width).attr("height", d => d.height).attr("rx", 5);
    nodes.append("text").attr("x", d => d.width / 2).attr("y", d => d.height / 2)
        .attr("dy", "0.35em").attr("text-anchor", "middle").text(d => d.label);
        
    if (highlightNodeId) {
        const targetNode = nodes.filter(d => d.id === highlightNodeId);
        if (!targetNode.empty()) {
            targetNode.classed('highlight', true);
            showInspectorForNode(targetNode.datum(), diagramIndex);
        }
    } else {
        showInspectorForNode(null, diagramIndex);
    }
}
