function parseFrontmatter(block) {
    const metadata = {};
    if (!block) return {};
    block.trim().split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) metadata[key.trim()] = valueParts.join(':').trim();
    });
    return metadata;
}

function buildOrchestrationNote(metadata) {
    const parts = [];
    if (metadata.dur) parts.push(`dur: <code>${metadata.dur}</code>`);
    if (metadata.delay) parts.push(`delay: <code>${metadata.delay}</code>`);
    if (metadata.wait) parts.push(`wait: <code>${metadata.wait}</code>`);
    if (parts.length > 0) return `<div class="orchestration-note">↳ ${parts.join(' | ')}</div>`;
    return '';
}

function processListItem(itemText, actionCatalog) {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = itemText.match(frontmatterRegex);
    let metadata = {};
    let contextualContent = itemText.trim();

    if (match) {
        metadata = parseFrontmatter(match[1]);
        contextualContent = contextualContent.replace(frontmatterRegex, '').trim();
    }

    const actionId = metadata.actionId;
    if (!actionId) return `<li><p><strong>ERRO:</strong> actionId não encontrado.</p></li>`;

    const actionDef = actionCatalog.get(actionId);
    if (!actionDef) return `<li><p><strong>ERRO:</strong> Definição para actionId "<code>${actionId}</code>" não encontrada.</p></li>`;

    let description = actionDef.description;
    contextualContent.match(/\{\{(.*?)\}\}/g)?.forEach(placeholder => {
        const key = placeholder.replace(/[{}]/g, '');
        const value = contextualContent.split(`${key}:`)[1]?.trim().split('\n')[0] || '';
        description = description.replace(placeholder, `<code>${value}</code>`);
    });

    const category = actionDef.category.toUpperCase();
    const refTag = metadata.ref ? `<code class="ref-code">[Ver: ${metadata.ref}]</code>` : '';
    const mainContentHtml = marked.parseInline(description);
    const eventIdHtml = metadata.id ? `<span class="event-id">${metadata.id}</span>` : '';
    const contextualContentHtml = contextualContent ? marked.parse(contextualContent.replace(/\{\{.*?\}\}/g, '')) : '';
    const orchestrationNoteHtml = buildOrchestrationNote(metadata);

    return `
        <li data-category="${category}">
            ${eventIdHtml}
            <p>
                <strong class="category-tag">${category}</strong>
                ${mainContentHtml} ${refTag}
            </p>
            ${contextualContentHtml}
            ${orchestrationNoteHtml}
        </li>
    `;
}

export function processMarkdown(markdownText, actionCatalog) {
    let finalHtml = '';
    const sections = markdownText.split(/(?=^#\s)/gm);

    sections.forEach(section => {
        if (!section.trim()) return;
        let mainTitleHtml = '';
        let content = section;

        const titleMatch = section.match(/^#\s(.*?)\n/);
        if (titleMatch) {
            mainTitleHtml = `<h1>${titleMatch[1]}</h1>`;
            content = section.replace(/^#\s.*?\n/, '').trim();
        }

        const phases = content.split(/###\s+/).filter(Boolean);
        const processedPhases = phases.map(phaseText => {
            const lines = phaseText.trim().split('\n');
            const phaseTitle = lines.shift().trim();
            const listContent = lines.join('\n');
            const listItems = listContent.split(/^\s*\d+\.\s*/gm).filter(Boolean);
            const processedItems = listItems.map(item => processListItem(item, actionCatalog)).join('');
            const listWrapper = `<ul class="phase-content">${processedItems}</ul>`;
            return `<h3>${phaseTitle}</h3>${listWrapper}`;
        });
        
        finalHtml += mainTitleHtml + processedPhases.join('');
    });
    return finalHtml;
}
