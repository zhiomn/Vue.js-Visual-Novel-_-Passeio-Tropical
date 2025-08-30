import { findEscolhaForAuthor } from './_helpers.js';
import pessoasData from '@/data/pessoas.json';
import cidadesData from '@/data/cidades.json';
import cenasData from '@/data/cenas.json';
import config from '@/data/config.json';

export function getUnlockedContacts(playerStore, readStatusStore) {
    // THE FIX IS HERE: We first sort the original data array by the real name.
    return [...pessoasData] // Use a shallow copy to prevent mutation of the imported module
        .sort((a, b) => a.name.localeCompare(b.name))
        // THEN, we map over the now-sorted array to create the display objects.
        .map(pessoa => {
            const city = cidadesData.find(c => c.id === pessoa.city_id);
            const areDetailsRevealed = config.allDataRevealed || readStatusStore.isContentUnlocked('message_details', pessoa.id);

            return {
                id: pessoa.id,
                // The name is masked for display *after* the list has been sorted.
                name: areDetailsRevealed ? pessoa.name : '???',
                types: pessoa.types || ['Contributor'],
                avatar : pessoa.avatar,
                link: pessoa.link,
                born_date: pessoa.born_date,
                descricao: pessoa.descricao,
                cityId: pessoa.city_id,
                cityName: city?.nome || 'Local Desconhecido',
                estado: city?.estado || '',
                isUnlocked: areDetailsRevealed,
            };
        });
}
