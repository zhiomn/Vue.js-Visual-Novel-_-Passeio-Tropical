// codes.js - Um agregador de código automático inspirado em PHP, reescrito para Node.js

// --- INSTRUÇÕES ---
// 1. Salve este arquivo como 'codes.js' na pasta raiz do seu projeto.
// 2. Abra o terminal nesta pasta.
// 3. Execute o comando: node codes.js
// 4. Abra seu navegador e acesse: http://localhost:3000

const http = require('http');
const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÃO ---
const PORT = 3000;
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'public', 'docs'];
const IGNORE_FILES = ['codes.cjs', 'codes.php', 'package-lock.json'];
const IGNORE_EXTENSIONS = ['.png', '.jpg', '.jpeg', 'webp', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.pdf'];

function getAllFiles(dir, fileList = []) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        // Ignora pastas da lista, e pastas ocultas
        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(item) && !item.startsWith('.')) {
                getAllFiles(fullPath, fileList);
            }
        } 
        // Ignora arquivos da lista, extensões da lista, e arquivos ocultos
        else {
            const ext = path.extname(item).toLowerCase();
            if (!IGNORE_FILES.includes(item) && !IGNORE_EXTENSIONS.includes(ext) && !item.startsWith('.')) {
                fileList.push(fullPath);
            }
        }
    }
    return fileList;
}

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    
    // Rota para gerar o arquivo de texto
    if (requestUrl.searchParams.get('action') === 'generate') {
        try {
            const files = getAllFiles('.');
            let output = '';
            for (const file of files) {
                const content = fs.readFileSync(file, 'utf-8');
                const relativePath = path.relative('.', file);
                
                output += `\n${'='.repeat(80)}\n`;
                output += `FILE: ${relativePath}\n`;
                output += `${'='.repeat(80)}\n\n`;
                output += content;
                output += `\n\n`;
            }

            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Disposition': 'attachment; filename="all_code.txt"'
            });
            res.end(output);
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Erro ao gerar o arquivo: ${error.message}`);
        }
        return;
    }

    // Rota principal que mostra a página HTML
    try {
        const files = getAllFiles('.');
        const fileListHtml = files.map(file => `<div class="file-item">📄 ${path.relative('.', file)}</div>`).join('');

        const htmlPage = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Agregador de Código Automático</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                    .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .file-list { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; max-height: 300px; overflow-y: auto; border: 1px solid #ddd;}
                    .file-item { padding: 5px; margin: 2px 0; font-family: monospace; font-size: 14px; }
                    button { background-color: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; width: 100%; }
                    button:hover { background-color: #0056b3; }
                    .stats { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🛠️ Agregador de Código Automático (Node.js)</h1>
                    <p>Esta ferramenta escaneia todos os arquivos relevantes e gera um único arquivo de texto com todo o código.</p>
                    <div class="stats"><strong>📊 Encontrados ${files.length} arquivos para processar</strong></div>
                    <div class="file-list">
                        <h3>Arquivos a serem incluídos:</h3>
                        ${fileListHtml}
                    </div>
                    <button onclick="window.open('?action=generate', '_blank')">🚀 Gerar & Baixar Todo o Código</button>
                </div>
            </body>
            </html>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlPage);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Erro ao carregar a página: ${error.message}`);
    }
});

server.listen(PORT, () => {
    console.log(`✅ Servidor do Agregador rodando!`);
    console.log(`   Acesse http://localhost:${PORT} no seu navegador.`);
    console.log(`   Pressione Ctrl+C para parar o servidor.`);
});
