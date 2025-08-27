import { defineStore } from 'pinia';
import { Howl } from 'howler';
import { useConfigStore } from './config';
import { createLogger } from '@/utils/loggers/loggerFactory';

const logger = createLogger('AudioStore', '#e879f9');
let audioPlayer = null; // Singleton Howl instance

export const useAudioStore = defineStore('audio', {
  state: () => ({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isSeeking: false,
    _intervalId: null,
  }),
  actions: {
    _cleanup() {
      if (audioPlayer) {
        audioPlayer.unload();
        audioPlayer = null;
        logger.log('Previous audio player instance unloaded.');
      }
      if (this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
      this.$reset();
    },

    _startProgressTimer() {
      if (this._intervalId) clearInterval(this._intervalId);
      this._intervalId = setInterval(() => {
        if (audioPlayer && !this.isSeeking && audioPlayer.playing()) {
          this.currentTime = audioPlayer.seek();
        }
      }, 250);
    },

    playTrack(trackObject) {
      const configStore = useConfigStore();

      if (this.currentTrack?.id !== trackObject.id) {
        this._cleanup();
        this.currentTrack = trackObject;

        logger.log(`Loading new track: ${trackObject.title}`);
        audioPlayer = new Howl({
          src: [trackObject.audioFile],
          volume: configStore.getSettingValue('musicVolume'),
          html5: true,
          onload: () => {
            this.duration = audioPlayer.duration();
            this.isPlaying = true;
            this._startProgressTimer();
            logger.log(`Track loaded. Duration: ${this.duration.toFixed(2)}s`);
          },
          onplay: () => {
            this.isPlaying = true;
            this._startProgressTimer();
          },
          onpause: () => {
            this.isPlaying = false;
            clearInterval(this._intervalId);
          },
          onend: () => {
            this.isPlaying = false;
            clearInterval(this._intervalId);
            this.currentTime = 0;
            logger.log('Track finished playing.');
          },
          onloaderror: (id, err) => {
            logger.error(`Error loading audio file for track ID ${id}`, err);
          },
          onplayerror: (id, err) => {
             logger.error(`Error playing audio file for track ID ${id}`, err);
          }
        });
        audioPlayer.play();

      } else {
        if (!audioPlayer) return;
        if (audioPlayer.playing()) {
          audioPlayer.pause();
          logger.log('Pausing current track.');
        } else {
          audioPlayer.play();
          logger.log('Resuming current track.');
        }
      }
    },
    
    // --- A NOVA AÇÃO PARA FEEDBACK DE UI ---
    playSfxSample(volume) {
      // Cria uma instância 'descartável' do Howl para não interferir com a música principal.
      const sfx = new Howl({
        src: ['./audio/sfx/ui_blip.mp3'],
        volume: volume,
      });
      sfx.play();
    },

    startSeeking() {
      if (!this.isSeeking) {
        this.isSeeking = true;
        logger.log('Seeking started.');
      }
    },

    endSeeking(time) {
      if (audioPlayer) {
        audioPlayer.seek(time);
        this.currentTime = time;
      }
      this.isSeeking = false;
      logger.log(`Seeking ended at ${time.toFixed(2)}s.`);
    },
    
    updateVolume() {
      if (audioPlayer) {
        const configStore = useConfigStore();
        const newVolume = configStore.getSettingValue('musicVolume');
        audioPlayer.volume(newVolume);
        logger.log(`Volume updated to ${newVolume}.`);
      }
    }
  }
});
