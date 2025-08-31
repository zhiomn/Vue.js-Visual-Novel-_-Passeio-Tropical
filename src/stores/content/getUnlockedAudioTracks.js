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
            
            const obra = obrasData.find(o => o.id === texto.obraId);
            const coverImagePath = obra ? `./assets/gallery/${obra.cover_image}` : '';
            
            // --- THE FIX IS HERE ---
            // Changed path from absolute "/audio/..." to relative "./audio/..."
            const audioPath = `./audio/${texto.audio}`;
            
            return {
                id: `audio_texto_${escolha.id}`,
                title: isUnlocked ? content?.title : '???',
                authorName: isUnlocked ? content?.authorName : '???',
                obraName: isUnlocked ? content?.obraName : '',
                coverImage: coverImagePath,
                audioFile: audioPath,
                isUnlocked: isUnlocked,
            };
        })
        .filter(Boolean);
}
