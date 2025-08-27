import { findEscolhaForText, findPessoaForScene } from './_helpers.js';
import obrasData from '@/data/obras.json';
import textosData from '@/data/textos.json';
import cenasData from '@/data/cenas.json';
import config from '@/data/config.json';

export function getGalleryContent(playerStore, phoneStore, readStatusStore) {
    // Part 1: Get Magazine Covers
    const revistas = obrasData
        .filter(obra => obra.cover_image)
        .map(obra => {
            const texto = textosData.find(t => t.obraId === obra.id);
            if (!texto) return null;
            const escolha = findEscolhaForText(texto.id);
            if (!escolha) return null;

            const itemId = `gal_revista_${escolha.id}`;
            
            // --- THE FIX IS HERE ---
            // 'isUnlocked' now correctly determines if the image can be viewed (causal unlock).
            // We no longer filter out the item if it's locked. It will always be in the list.
            const isUnlocked = config.allDataRevealed || readStatusStore.isContentUnlocked('gallery', itemId);

            return {
                id: itemId,
                type: 'revista',
                name: obra.name,
                url: `./assets/gallery/${obra.cover_image}`,
                thumbnailUrl: `./assets/gallery/thumbnails/${obra.cover_image}`,
                isUnlocked: isUnlocked,
                obra: { title: obra.name, date: obra.date }
            };
        })
        .filter(Boolean);

    // Part 2: Get Paintings
    let pinturas = [];
    const isContactsAppUnlocked = phoneStore.getAppState('contacts').isUnlocked;

    if ((playerStore.runCount >= 2 && isContactsAppUnlocked) || config.allDataRevealed) {
        pinturas = cenasData
            .filter(cena => cena.painterId)
            .map(cena => {
                const painter = findPessoaForScene(cena.id);
                
                // --- THE FIX IS HERE ---
                // 'isUnlocked' is true only if the scene has been viewed.
                // We no longer filter out the painting if it's locked.
                const isUnlocked = readStatusStore.isSceneViewed(cena.id);
                
                return {
                    id: `gal_pintura_${cena.id}`,
                    type: 'pintura',
                    name: painter ? painter.name : 'Artista Desconhecido',
                    url: `./assets/images/backgrounds/${cena.imagem}`,
                    thumbnailUrl: `./assets/images/backgrounds/thumbnails/${cena.imagem}`,
                    isUnlocked: isUnlocked,
                    obra: { 
                        title: cena.nome, 
                        date: '',
                        pintura_name: cena.pintura_name || 'Título Desconhecido'
                    }
                };
            })
            .filter(Boolean);
    }

    const showFolderView = (playerStore.runCount >= 2 && isContactsAppUnlocked && pinturas.length > 0) || (config.allDataRevealed);
    
    return { revistas, pinturas, showFolderView };
}
