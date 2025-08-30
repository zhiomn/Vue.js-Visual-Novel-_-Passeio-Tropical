import { createLogger } from '@/utils/loggers/loggerFactory';
import cenasData from '@/data/cenas.json';

const logger = createLogger('Preloader', '#f59e0b');

/**
 * Preloads critical assets for the game.
 * Currently preloads all background images from cenas.json.
 * @returns {Promise<void>} A promise that resolves when all assets are loaded.
 */
export function preloadAssets() {
  logger.log('Starting asset preloading (backgrounds only)...');
  
  const imageSources = cenasData
    .map(cena => cena.imagem)
    .filter(Boolean) // Filter out any scenes that might not have an image
    .map(imageFile => `./assets/images/backgrounds/${imageFile}`);

  const imagePromises = imageSources.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
  });

  return new Promise((resolve) => {
    Promise.all(imagePromises)
      .then(loadedImages => {
        logger.log(`${loadedImages.length} background images preloaded successfully.`);
        resolve();
      })
      .catch(error => {
        logger.error('An error occurred during image preloading:', error);
        // We still resolve so the game doesn't get stuck on the loading screen.
        // The browser will try to load the images again when needed.
        resolve(); 
      });
  });
}
