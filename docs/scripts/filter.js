export function initializeFilters(filterContainer, filterCategories, onFilterClick) {
    filterContainer.innerHTML = '';
    const allButton = document.createElement('button');
    allButton.textContent = 'Ver Todos';
    allButton.className = 'filter-btn active';
    allButton.dataset.category = 'Ver Todos';
    allButton.addEventListener('click', () => onFilterClick('Ver Todos'));
    filterContainer.appendChild(allButton);

    filterCategories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.className = 'filter-btn';
        button.dataset.category = category;
        button.addEventListener('click', () => onFilterClick(category));
        filterContainer.appendChild(button);
    });
}

export function applyFilterToContent(contentDisplay, activeFilters) {
    const allItems = contentDisplay.querySelectorAll('li[data-category]');
    const showAll = activeFilters.length === 0;

    allItems.forEach(item => {
        if (showAll) {
            item.classList.remove('hidden-item');
            return;
        }
        const itemCategory = item.dataset.category;
        if (activeFilters.includes(itemCategory)) {
            item.classList.remove('hidden-item');
        } else {
            item.classList.add('hidden-item');
        }
    });
}

export function updateFilterButtonStates(filterContainer, filterCategories, activeFilters) {
    const allButtons = filterContainer.querySelectorAll('.filter-btn');
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    allButtons.forEach(btn => {
        const category = btn.dataset.category;
        if (category === 'Ver Todos') {
            btn.classList.toggle('active', activeFilters.length === 0);
        } else {
            const normalizedButtonCategory = normalize(category);
            btn.classList.toggle('active', activeFilters.includes(normalizedButtonCategory));
        }
    });
}
