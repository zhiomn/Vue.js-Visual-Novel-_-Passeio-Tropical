document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('diagram-index');
    if (!container) return;

    try {
        const response = await fetch('diagrams.json');
        const data = await response.json();

        const groupedByCategory = data.diagrams.reduce((acc, diagram) => {
            const category = diagram.category || 'Uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(diagram);
            return acc;
        }, {});

        let html = '';
        for (const category in groupedByCategory) {
            html += `<h2>${category}</h2>`;
            html += '<ul>';
            groupedByCategory[category].forEach(diagram => {
                html += `<li><a href="${diagram.path}" target="diagram_frame">${diagram.title}</a></li>`;
            });
            html += '</ul>';
        }
        container.innerHTML = html;
        
        // Carregar o primeiro diagrama por padrão no iframe
        const firstDiagramPath = data.diagrams[0]?.path;
        if(firstDiagramPath) {
            document.getElementById('diagram_frame').src = firstDiagramPath;
        }

    } catch (error) {
        console.error('Failed to load or build diagram index:', error);
        container.innerHTML = '<p style="color: red;">Failed to load diagrams.json.</p>';
    }
});
