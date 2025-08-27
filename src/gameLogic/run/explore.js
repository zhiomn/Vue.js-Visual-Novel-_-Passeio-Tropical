import cenasData from '@/data/cenas.json';
import escolhasData from '@/data/escolhas.json';
import config from '@/data/config.json';

/**
 * A pure function to shuffle an array and return a new shuffled array.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} A new array containing the same elements in a random order.
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Finds all available, unchosen choices for a given scene AND shuffles them.
 * Respects the 'allDataRevealed' developer flag.
 * @param {string} sceneName - The name of the current scene.
 * @param {Array<number>} unlockedEscolhaIds - An array of choice IDs the player has already unlocked.
 * @returns {Array<object>} A randomly ordered array of available choice objects.
 */
export function getAvailableChoices(sceneName, unlockedEscolhaIds) {
  // --- DEVELOPER OVERRIDE ---
  if (config.allDataRevealed) {
    const allChoicesForScene = escolhasData.filter(e => e.cena === sceneName);
    return shuffleArray(allChoicesForScene);
  }

  // Normal game logic
  const available = escolhasData.filter(e =>
    e.cena === sceneName && !unlockedEscolhaIds.includes(e.id)
  );
  return shuffleArray(available);
}

/**
 * Finds a random scene to travel to, excluding already visited scenes.
 * @param {Array<string>} visitedScenes - An array of scene names already visited in this run.
 * @returns {object|null} A random scene object, or null if none are available.
 */
export function getRandomScene(visitedScenes) {
    const availableScenes = cenasData.filter(c => !visitedScenes.includes(c.nome));
    if (availableScenes.length === 0) return null;
    return availableScenes[Math.floor(Math.random() * availableScenes.length)];
}

/**
 * Finds up to two travel destinations, excluding already visited scenes.
 * @param {Array<string>} visitedScenes - An array of scene names already visited in this run.
 * @returns {Array<string>} An array of scene names for travel.
 */
export function getTravelOptions(visitedScenes) {
    const available = cenasData.filter(c => !visitedScenes.includes(c.nome));
    if (available.length === 0) return [];
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2).map(s => s.nome);
}
