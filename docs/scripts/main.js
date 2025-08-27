import { getSequences, fetchAndParseMarkdown } from './api.js';
import { createNavButtons } from './navigation.js';
import { renderContent } from './content.js';
import { initializeFilters, applyFilterToContent, updateFilterButtonStates } from './filter.js';

document.addEventListener('DOMContentLoaded', () => {
    const contentDisplay = document.getElementById('content-display');
    const navContainer = document.getElementById('sequence-nav');
    const filterContainer = document.getElementById('filter-controls');
    const filterCategories = ['UI', 'LÓGICA', 'ÁUDIO', 'Gatilho', 'SISTEMA'];
    let activeFilters = [];
    const normalizeCategory = (category) => category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    async function loadSequence(filePath, isExternal) {
        if (isExternal) {
            filterContainer.style.display = 'none';
            renderContent(contentDisplay, filePath, true);
        } else {
            filterContainer.style.display = 'flex';
            const htmlContent = await fetchAndParseMarkdown(filePath);
            renderContent(contentDisplay, htmlContent, false);
            activeFilters = [];
            initializeFilters(filterContainer, filterCategories, handleFilterClick);
        }
    }

    function handleFilterClick(category) {
        const upperCategory = normalizeCategory(category);
        if (upperCategory === 'VER TODOS') {
            activeFilters = [];
        } else {
            const index = activeFilters.indexOf(upperCategory);
            if (index > -1) activeFilters.splice(index, 1);
            else activeFilters.push(upperCategory);
        }
        updateFilterButtonStates(filterContainer, activeFilters);
        applyFilterToContent(contentDisplay, activeFilters);
    }
    
    function init() {
        const sequences = getSequences();
        createNavButtons(navContainer, sequences, loadSequence);
        navContainer.querySelector('button')?.click();
    }
    init();
});
