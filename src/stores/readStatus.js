import { defineStore } from 'pinia';
import { usePlayerStore } from './player';
import { logger } from '@/utils/logger';
import config from '@/data/config.json';

// Import all data sources required by the causal unlock service and the store itself
import escolhasData from '@/data/escolhas.json';
import textosData from '@/data/textos.json';
import pessoasData from '@/data/pessoas.json';
import obrasData from '@/data/obras.json';
import cenasData from '@/data/cenas.json';


// --- START: Internal Causal Unlock Logic ---
// This logic is now part of the readStatusStore module, as it's the only place that uses it.

function getAuthorIdFromEscolhaId(escolhaId) {
  const escolha = escolhasData.find(e => e.id == escolhaId);
  if (!escolha) return null;
  const texto = textosData.find(t => t.id === escolha.textId);
  return texto?.authorId || null;
}

function getCityIdFromAuthorId(authorId) {
  const pessoa = pessoasData.find(p => p.id === authorId);
  return pessoa?.city_id || null;
}

function getObraIdFromEscolhaId(escolhaId) {
  const escolha = escolhasData.find(e => e.id == escolhaId);
  if (!escolha) return null;
  const texto = textosData.find(t => t.id === escolha.textId);
  return texto?.obraId || null;
}

function getPainterIdFromSceneId(sceneId) {
    const cena = cenasData.find(c => c.id === sceneId);
    return cena?.painterId || null;
}

function processUnlocks(consumedType, consumedId) {
  const unlocks = [];
  
  if (consumedType === 'notes' && consumedId.startsWith('note_')) {
    const baseId = consumedId.replace('note_', '');
    unlocks.push({ type: 'gallery', id: `gal_revista_${baseId}` });
    unlocks.push({ type: 'audio', id: `audio_texto_${baseId}` });
    const authorId = getAuthorIdFromEscolhaId(baseId);
    if (authorId) {
      unlocks.push({ type: 'message_details', id: authorId });
    }
  }

  if (consumedType === 'contacts') {
    const authorId = consumedId;
    const cityId = getCityIdFromAuthorId(authorId);
    if (cityId) {
      unlocks.push({ type: 'map_locations', id: cityId });
    }
  }

  if (consumedType === 'gallery' && consumedId.startsWith('gal_revista_')) {
    const baseId = consumedId.replace('gal_revista_', '');
    const obraId = getObraIdFromEscolhaId(baseId);
    if (obraId) {
      unlocks.push({ type: 'ereader', id: obraId });
    }
  }

  if (consumedType === 'gallery' && consumedId.startsWith('gal_pintura_')) {
    const sceneId = consumedId.replace('gal_pintura_', '');
    const painterId = getPainterIdFromSceneId(sceneId);
    if (painterId) {
      logger.info(`Unlocking painter ${painterId} from viewing scene ${sceneId}`);
      unlocks.push({ type: 'message_details', id: painterId });
    }
  }

  return unlocks;
}
// --- END: Internal Causal Unlock Logic ---


export const useReadStatusStore = defineStore('readStatus', {
  state: () => ({
    readIds: {
      notes: new Set(),
      contacts: new Set(),
      gallery: new Set(),
      audio: new Set(),
    },
    unlockedContent: {
      gallery: new Set(),
      audio: new Set(),
      message_details: new Set(),
      map_locations: new Set(),
      ereader: new Set(),
    },
    viewedSceneIds: new Set(),
  }),
  getters: {
    isRead: (state) => (type, id) => state.readIds[type]?.has(id),
    isContentUnlocked: (state) => (type, id) => state.unlockedContent[type]?.has(id),
    isSceneViewed: (state) => (sceneId) => state.viewedSceneIds.has(sceneId),
  },
  actions: {
    markAsRead(type, id) {
      if (this.readIds[type]?.has(id)) return;
      
      this.readIds[type].add(id);
      logger.info(`Marked as Read: ${type} - ${id}`);

      const triggeredUnlocks = processUnlocks(type, id);
      
      if (triggeredUnlocks.length > 0) {
        triggeredUnlocks.forEach(unlock => {
          if (this.unlockedContent[unlock.type]) {
            this.unlockedContent[unlock.type].add(unlock.id);
            logger.info(`Causal Unlock Triggered: ${unlock.type} - ${unlock.id}`);
          }
        });
      }
    },

    markSceneAsViewed(sceneId) {
        const playerStore = usePlayerStore();
        if (playerStore.runCount >= 2 && !this.viewedSceneIds.has(sceneId)) {
            this.viewedSceneIds.add(sceneId);
            logger.info(`Scene Viewed and Registered: ${sceneId}`);
        }
    },

    markAllAsRead() {
      logger.info('DEV MODE: Marking all content as read and unlocked.');
      
      escolhasData.forEach(e => this.readIds.notes.add(`note_${e.id}`));
      pessoasData.forEach(p => this.readIds.contacts.add(p.id));
      obrasData.forEach(o => {
        const escolha = escolhasData.find(e => e.textId === textosData.find(t => t.obraId === o.id)?.id);
        if (escolha) this.readIds.gallery.add(`gal_revista_${escolha.id}`);
      });
      textosData.forEach(t => {
          const escolha = escolhasData.find(e => e.textId === t.id);
          if (escolha) this.readIds.audio.add(`audio_texto_${escolha.id}`);
      });
      cenasData.forEach(c => this.viewedSceneIds.add(c.id));
      cenasData.forEach(c => {
          if(c.painterId) this.readIds.gallery.add(`gal_pintura_${c.id}`);
      });


      this.readIds.notes.forEach(id => this.markAsRead('notes', id));
      this.readIds.contacts.forEach(id => this.markAsRead('contacts', id));
      this.readIds.gallery.forEach(id => this.markAsRead('gallery', id));
    },
    
    saveReadStatus() {
      if (config.allDataRevealed) return;

      const serializableState = {
        readIds: {
          notes: [...this.readIds.notes],
          contacts: [...this.readIds.contacts],
          gallery: [...this.readIds.gallery],
          audio: [...this.readIds.audio],
        },
        unlockedContent: {
          gallery: [...this.unlockedContent.gallery],
          audio: [...this.unlockedContent.audio],
          message_details: [...this.unlockedContent.message_details],
          map_locations: [...this.unlockedContent.map_locations],
          ereader: [...this.unlockedContent.ereader],
        },
        viewedSceneIds: [...this.viewedSceneIds],
      };
      localStorage.setItem('game_read_status', JSON.stringify(serializableState));
    },
    
    loadReadStatus() {
      const savedStatus = localStorage.getItem('game_read_status');
      if (savedStatus) {
        const parsedStatus = JSON.parse(savedStatus);
        
        if (parsedStatus.readIds) {
          this.readIds.notes = new Set(parsedStatus.readIds.notes || []);
          this.readIds.contacts = new Set(parsedStatus.readIds.contacts || []);
          this.readIds.gallery = new Set(parsedStatus.readIds.gallery || []);
          this.readIds.audio = new Set(parsedStatus.readIds.audio || []);
        }
        if (parsedStatus.unlockedContent) {
          this.unlockedContent.gallery = new Set(parsedStatus.unlockedContent.gallery || []);
          this.unlockedContent.audio = new Set(parsedStatus.unlockedContent.audio || []);
          this.unlockedContent.message_details = new Set(parsedStatus.unlockedContent.message_details || []);
          this.unlockedContent.map_locations = new Set(parsedStatus.unlockedContent.map_locations || []);
          this.unlockedContent.ereader = new Set(parsedStatus.unlockedContent.ereader || []);
        }
        if (parsedStatus.viewedSceneIds) {
            this.viewedSceneIds = new Set(parsedStatus.viewedSceneIds || []);
        }
        logger.info('Loaded read status from LocalStorage.');
      }
    }
  }
});
