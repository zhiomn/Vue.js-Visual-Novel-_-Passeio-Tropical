// This new helper file contains functions shared across multiple content getters,
// preventing code duplication.

import textosData from '@/data/textos.json';
import escolhasData from '@/data/escolhas.json';
import pessoasData from '@/data/pessoas.json';
import cenasData from '@/data/cenas.json';

export function findEscolhaForAuthor(authorId) {
  const texto = textosData.find(t => t.authorId === authorId);
  return texto ? escolhasData.find(e => e.textId === texto.id) : null;
}

export function findEscolhaForText(textId) {
  return escolhasData.find(e => e.textId === textId);
}

export function findPessoaForScene(sceneId) {
    const scene = cenasData.find(c => c.id === sceneId);
    return scene ? pessoasData.find(p => p.id === scene.painterId) : null;
}
