import obrasData from '@/data/obras.json';
import config from '@/data/config.json';

export function getUnlockedObras(readStatusStore) {
    return obrasData.map(obra => {
        const isUnlocked = config.allDataRevealed || readStatusStore.isContentUnlocked('ereader', obra.id);
        return {
          ...obra,
          thumbnail_url: `./assets/gallery/thumbnails/${obra.cover_image}`,
          isUnlocked: isUnlocked,
        };
      });
}
