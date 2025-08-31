import { defineStore } from 'pinia';
import { usePlayerStore } from './player';
import { useReadStatusStore } from './readStatus';
import { usePhoneStore } from './phone';
import { createLogger } from '@/utils/loggers/loggerFactory';

// Import data sources needed for initialization
import escolhasData from '@/data/escolhas.json';
import textosData from '@/data/textos.json';
import pessoasData from '@/data/pessoas.json';
import obrasData from '@/data/obras.json';
import cidadesData from '@/data/cidades.json';
import videosData from '@/data/videos.json'; // <-- Import new data

// Import our new selector functions from the 'content' subdirectory
import { getUnlockedNotes } from './content/getUnlockedNotes';
import { getUnlockedMessages, isContactUnread } from './content/getUnlockedMessages';
import { getGalleryContent } from './content/getGalleryContent';
import { getUnlockedContacts } from './content/getUnlockedContacts';
import { getUnlockedAudioTracks } from './content/getUnlockedAudioTracks';
import { getUnlockedMapLocations } from './content/getUnlockedMapLocations';
import { getUnlockedObras } from './content/getUnlockedObras';
import { getUnlockedContentObjects } from './content/getUnlockedContentObjects';

const logger = createLogger('ContentStore', '#10b981');

export const useContentStore = defineStore('content', {
  state: () => ({
    _masterContentMap: new Map(),
    _isInitialized: false,
  }),

  actions: {
    _initializeMasterContentMap() {
      if (this._isInitialized) return;
      logger.log('Initializing Master Content Map...');

      escolhasData.forEach(escolha => {
        const texto = textosData.find(t => t.id === escolha.textId);
        if (!texto) return;

        const pessoa = pessoasData.find(p => p.id === texto.authorId);
        const obra = obrasData.find(o => o.id === texto.obraId);
        const cidade = cidadesData.find(c => c.id === pessoa?.city_id);

        const contentObject = {
          escolhaId: escolha.id,
          scene: escolha.cena,
          buttonText: escolha.escolha,
          galleryImage: escolha.imagem,
          
          textId: texto.id,
          title: texto.titulo,
          messageText: texto.trecho,
          noteText: texto.conteudo,
          audioFile: texto.audio,
          
          authorId: pessoa?.id,
          authorName: pessoa?.name,
          authorTypes: pessoa?.types,
          authorAvatar: pessoa?.avatar,
          
          obraId: obra?.id,
          obraName: obra?.name,
          obraDate: obra?.date,

          cityId: cidade?.id,
          cityName: cidade?.nome,
          estado: cidade?.estado,
          pais: cidade?.pais,
        };
        this._masterContentMap.set(escolha.id, contentObject);
      });

      this._isInitialized = true;
      logger.log('Master Content Map initialized successfully.');
    },
  },

  getters: {
    _unlockedContentObjects() {
      if (!this._isInitialized) this._initializeMasterContentMap();
      const playerStore = usePlayerStore();
      return getUnlockedContentObjects(playerStore, this._masterContentMap);
    },

    unlockedObras() {
      const readStatusStore = useReadStatusStore();
      return getUnlockedObras(readStatusStore);
    },

    unlockedMessages() {
      return getUnlockedMessages(this._unlockedContentObjects);
    },
    
    unlockedNotes() {
      return getUnlockedNotes(this._unlockedContentObjects);
    },

    galleryContent() {
      const playerStore = usePlayerStore();
      const phoneStore = usePhoneStore();
      const readStatusStore = useReadStatusStore();
      return getGalleryContent(playerStore, phoneStore, readStatusStore);
    },

    unlockedContacts() {
      const playerStore = usePlayerStore();
      const readStatusStore = useReadStatusStore();
      return getUnlockedContacts(playerStore, readStatusStore);
    },

    unlockedAudioTracks() {
      if (!this._isInitialized) this._initializeMasterContentMap();
      const playerStore = usePlayerStore();
      const readStatusStore = useReadStatusStore();
      return getUnlockedAudioTracks(playerStore, readStatusStore, this._masterContentMap);
    },

    unlockedMapLocations() {
      const readStatusStore = useReadStatusStore();
      return getUnlockedMapLocations(readStatusStore);
    },
    
    // --- NEW GETTER ---
    unlockedVideos() {
      const phoneStore = usePhoneStore();
      // For now, if the app is unlocked, all videos are available.
      // This can be expanded later with causal unlock logic if needed.
      if (phoneStore.getAppState('video').isUnlocked) {
        return videosData;
      }
      return [];
    },

    isContactUnread: (state) => (contactId) => {
      const readStatusStore = useReadStatusStore();
      return isContactUnread(contactId, state.unlockedMessages, readStatusStore);
    },
  },
});
