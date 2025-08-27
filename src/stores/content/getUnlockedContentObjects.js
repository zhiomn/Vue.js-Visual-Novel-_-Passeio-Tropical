import config from '@/data/config.json';

export function getUnlockedContentObjects(playerStore, masterContentMap) {
    const idsToProcess = config.allDataRevealed
        ? Array.from(masterContentMap.keys())
        : playerStore.unlockedEscolhaIds;

    return idsToProcess
        .map(id => masterContentMap.get(id))
        .filter(Boolean);
}
