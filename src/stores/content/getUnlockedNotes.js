export function getUnlockedNotes(unlockedContentObjects) {
    return unlockedContentObjects.map(content => ({
        id: `note_${content.escolhaId}`,
        title: content.title,
        author: content.authorName,
        text: content.noteText,
        obra: `${content.obraName} - ${content.obraDate}`
    }));
}
