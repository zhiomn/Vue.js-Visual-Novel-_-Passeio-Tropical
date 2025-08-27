export function renderContent(contentDisplay, htmlContent, isExternal = false) {
    contentDisplay.innerHTML = ''; // Limpa o conteúdo anterior
    if (isExternal) {
        const iframe = document.createElement('iframe');
        iframe.src = htmlContent; // htmlContent é o caminho do arquivo
        iframe.style.width = '100%';
        iframe.style.height = '80vh';
        iframe.style.border = 'none';
        contentDisplay.appendChild(iframe);
    } else {
        contentDisplay.innerHTML = htmlContent;
    }
}
