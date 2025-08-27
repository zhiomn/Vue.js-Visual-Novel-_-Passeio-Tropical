import { findEscolhaForText } from './_helpers.js';
import textosData from '@/data/textos.json';
import obrasData from '@/data/obras.json'; // Import obrasData directly
import config from '@/data/config.json';

export function getUnlockedAudioTracks(playerStore, readStatusStore, masterContentMap) {
    return textosData
        .filter(texto => texto.audio)
        .map(texto => {
            const escolha = findEscolhaForText(texto.id);
            if (!escolha) return null;

            const existsInList = playerStore.isChoiceUnlocked(escolha.id);
            
            if (!existsInList && !config.allDataRevealed) return null;
    
            const isUnlocked = config.allDataRevealed || readStatusStore.isRead('notes', `note_${escolha.id}`);
            const content = isUnlocked ? masterContentMap.get(escolha.id) : null;
            
            // --- THE FIX IS HERE ---
            // The logic now directly uses the `obraId` from the text to find the cover image.
            const obra = obrasData.find(o => o.id === texto.obraId);
            const coverImagePath = obra ? `./assets/gallery/${obra.cover_image}` : '';
            const audioPath = `/audio/${texto.audio}`;
            
            return {
                id: `audio_texto_${escolha.id}`,
                title: isUnlocked ? content?.title : '???',
                authorName: isUnlocked ? content?.authorName : '???',
                obraName: isUnlocked ? content?.obraName : '',
                coverImage: coverImagePath, // Use the new, direct path
                audioFile: audioPath,
                isUnlocked: isUnlocked,
            };
        })
        .filter(Boolean);
}
