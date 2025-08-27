export function createNavButtons(navContainer, sequences, onButtonClick) {
    navContainer.innerHTML = '';
    const groupedSequences = sequences.reduce((acc, seq) => {
        const category = seq.category || 'Geral';
        if (!acc[category]) acc[category] = [];
        acc[category].push(seq);
        return acc;
    }, {});
    const categoryOrder = ['Sequências de Eventos', 'Diagramas de Arquitetura', 'Documentação'];
    categoryOrder.forEach(category => {
        if (groupedSequences[category]) {
            const title = document.createElement('h2');
            title.textContent = category;
            navContainer.appendChild(title);
            groupedSequences[category].forEach((seq) => {
                const button = document.createElement('button');
                button.innerHTML = `<i class="${seq.icon} fa-fw"></i> ${seq.name}`;
                button.addEventListener('click', (event) => {
                    navContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                    if (seq.isExternal) {
                        onButtonClick(seq.file, true);
                    } else {
                        onButtonClick(`parts/${seq.file}`, false);
                    }
                });
                navContainer.appendChild(button);
            });
        }
    });
}
