import { defineStore } from 'pinia';
import { useContentStore } from './contentStore';
import { useReadStatusStore } from './readStatus';

/**
 * A generic function to check for unread content.
 * @param {string} contentType - The type of content (e.g., 'notes').
 * @param {Array} contentArray - The array of all unlocked items.
 * @param {object} readStatusStore - An instance of the readStatus store.
 * @returns {boolean} - True if there is at least one unread item.
 */
function checkForUnread(contentType, contentArray, readStatusStore) {
  if (!contentArray || contentArray.length === 0) return false;
  return contentArray.some(item => !readStatusStore.isRead(contentType, item.id));
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({}),
  getters: {
    hasUnreadMessages() {
      const contentStore = useContentStore();
      const readStatusStore = useReadStatusStore();
      if (!contentStore.unlockedMessages) return false;
      return contentStore.unlockedMessages.some(contact =>
        contact.messages.some(message => !readStatusStore.isRead('messages', message.id))
      );
    },
    hasUnreadNotes() {
      const contentStore = useContentStore();
      const readStatusStore = useReadStatusStore();
      return checkForUnread('notes', contentStore.unlockedNotes, readStatusStore);
    },
    hasUnreadGalleryItems() {
      const contentStore = useContentStore();
      const readStatusStore = useReadStatusStore();
      
      // Safely access the new galleryContent object.
      const galleryData = contentStore.galleryContent;
      if (!galleryData) return false;

      // Combine both arrays (revistas and pinturas) into one list of items.
      const allItems = [...galleryData.revistas, ...galleryData.pinturas];
      
      // Filter for items that are visually unlocked and then check their read status.
      const unlockedItems = allItems.filter(item => item.isUnlocked);
      
      return checkForUnread('gallery', unlockedItems, readStatusStore);
    },
    
    // A master getter for the main phone toggle button
    hasAnyNotification() {
      return this.hasUnreadMessages || this.hasUnreadNotes || this.hasUnreadGalleryItems;
    },
  },
  actions: {}
});
