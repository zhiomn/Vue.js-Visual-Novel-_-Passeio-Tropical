import { useReadStatusStore } from '../readStatus';
import { usePlayerStore } from '../player';

// Helper para encontrar o primeiro escolhaId associado a um autor
function findFirstEscolhaIdForAuthor(authorId, unlockedContentObjects) {
    const content = unlockedContentObjects.find(c => c.authorId === authorId);
    return content ? content.escolhaId : -1;
}

export function getUnlockedMessages(unlockedContentObjects) {
    const readStatusStore = useReadStatusStore();
    const playerStore = usePlayerStore();
    const contacts = new Map();
    const MYSTERY_AVATAR_ICON = 'fa-solid fa-circle-user';

    unlockedContentObjects.forEach(content => {
        if (!content.authorId || !content.messageText) return;

        const shouldReveal = readStatusStore.isContentUnlocked('message_details', content.authorId);

        if (!contacts.has(content.authorId)) {
            contacts.set(content.authorId, {
                id: content.authorId,
                name: shouldReveal ? content.authorName : '???',
                avatar: shouldReveal ? content.authorAvatar : MYSTERY_AVATAR_ICON,
                isAvatarIcon: !shouldReveal,
                messages: []
            });
        }

        const lines = content.messageText.split('\n').filter(line => line.trim() !== '');
        const newMessages = lines.map((line, index) => ({ id: `msg_${content.escolhaId}_${index}`, text: line.trim() }));
        contacts.get(content.authorId).messages.push(...newMessages);
    });

    const contactsArray = Array.from(contacts.values());

    contactsArray.sort((a, b) => {
        const firstEscolhaA = findFirstEscolhaIdForAuthor(a.id, unlockedContentObjects);
        const firstEscolhaB = findFirstEscolhaIdForAuthor(b.id, unlockedContentObjects);

        const indexA = playerStore.unlockedEscolhaIds.indexOf(firstEscolhaA);
        const indexB = playerStore.unlockedEscolhaIds.indexOf(firstEscolhaB);

        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexB - indexA;
    });

    return contactsArray;
}

export function isContactUnread(contactId, unlockedMessages, readStatusStore) {
    const contact = unlockedMessages.find(c => c.id === contactId);
    if (!contact || !contact.messages) return false;
    
    return contact.messages.some(message => !readStatusStore.isRead('messages', message.id));
}
