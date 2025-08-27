import cidadesData from '@/data/cidades.json';
import config from '@/data/config.json';

export function getUnlockedMapLocations(readStatusStore) {
    return cidadesData.map(city => {
        const isUnlocked = config.allDataRevealed || readStatusStore.isContentUnlocked('map_locations', city.id);
        return {
          ...city,
          isUnlocked: isUnlocked,
        };
      }).sort((a, b) => a.nome.localeCompare(b.nome));
}
