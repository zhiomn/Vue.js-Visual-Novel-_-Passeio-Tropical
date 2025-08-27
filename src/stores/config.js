import { defineStore } from 'pinia'
// We import our static configuration file as the default state
import configData from '@/data/config.json'

export const useConfigStore = defineStore('config', {
  // The initial state of our store is the data loaded directly from config.json
  state: () => ({
    // We use a deep copy to prevent accidental direct mutation of the imported JSON object
    settings: JSON.parse(JSON.stringify(configData.settings)),
    // We also store the non-setting related config data
    gameTitle: configData.gameTitle,
    version: configData.version,
    totalRuns: configData.totalRuns,
    phoneOnly: configData.phoneOnly
  }),

  getters: {
    // Getter to get a specific setting's object by its key
    // Example: getSetting('textSpeed') -> returns the whole textSpeed object
    getSetting: (state) => (key) => {
      return state.settings[key];
    },

    // Getter to get just the current value of a setting
    // Example: getSettingValue('textSpeed') -> returns 50
    getSettingValue: (state) => (key) => {
      // Allow fetching top-level config keys like 'phoneOnly' as well
      if (key in state) {
        return state[key];
      }
      return state.settings[key]?.value;
    }
  },

  actions: {
    /**
     * Updates the value of a specific setting.
     * This is the action our Settings App UI will call.
     * @param {Object} payload - The payload object.
     * @param {string} payload.key - The key of the setting to update (e.g., 'textSpeed').
     * @param {*} payload.value - The new value for the setting.
     */
    updateSetting(payload) {
      const { key, value } = payload;
      
      console.log(`[ConfigStore ACTION]: Updating setting "${key}" to`, value);

      // Check if the setting exists before trying to update it
      if (this.settings[key]) {
        this.settings[key].value = value;
        // Here you could also add logic to save settings to localStorage
        // for persistence between sessions.
      } else {
        console.warn(`[ConfigStore WARN]: Attempted to update non-existent setting "${key}"`);
      }
    },

    // Example of an action to save settings to the browser's localStorage
    saveSettingsToLocalStorage() {
      console.log('[ConfigStore ACTION]: Saving settings to LocalStorage.');
      // We only save the 'settings' part, not the whole config
      localStorage.setItem('game_settings', JSON.stringify(this.settings));
    },

    // Example of an action to load settings from localStorage when the game starts
    loadSettingsFromLocalStorage() {
      const savedSettings = localStorage.getItem('game_settings');
      if (savedSettings) {
        console.log('[ConfigStore ACTION]: Found and loading settings from LocalStorage.');
        const parsedSettings = JSON.parse(savedSettings);
        // The $patch method is a Pinia utility to update multiple state properties at once
        this.$patch({ settings: parsedSettings });
      } else {
        console.log('[ConfigStore ACTION]: No saved settings found in LocalStorage. Using defaults.');
      }
    }
  }
})
