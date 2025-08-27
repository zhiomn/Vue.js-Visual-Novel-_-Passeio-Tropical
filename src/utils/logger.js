import config from '@/data/config.json';

const LOG_PREFIX = '[TV Engine]';
const DEBUG_MODE = config.debugMode;

function log(message, style, data) {
  if (!DEBUG_MODE) return;

  console.log(`%c${LOG_PREFIX}`, style, message, data !== undefined ? data : '');
}

export const logger = {
  startGroup(title) {
    if (!DEBUG_MODE) return;
    console.groupCollapsed(title);
  },

  endGroup() {
    if (!DEBUG_MODE) return;
    console.groupEnd();
  },

  logPhaseTransition(fromPhase, toPhase) {
    log(`Phase Transition: ${fromPhase} -> ${toPhase}`, 'color: #8c9eff; font-weight: bold;');
  },

  logActionExecution(action) {
    log(`Executing Action: ${action.id} (Type: ${action.type})`, 'color: #4ade80;', action.payload);
  },

  logInteractionsLoaded(count, context) {
    log(`Loaded ${count} interaction(s) for context: ${context}`, 'color: #fb923c;');
  },

  logNarration(event, data) {
    const message = `Narration Event: ${event}`;
    log(message, 'color: #e879f9;', data);
  },

  logDataQuery(source, context) {
    const message = `Data Query on: ${source}`;
    log(message, 'color: #facc15;', context);
  },
  
  logUIState(componentName, stateObject) {
    log(`UI State Snapshot for: <${componentName}>`, 'color: #22d3ee; font-weight: bold;', stateObject);
  },

  logGetterOutput(getterName, output) {
    log(`Getter Output: ${getterName}`, 'color: #10b981; font-weight: bold;', output);
  },

  /**
   * NOVO: Log para registrar mudanças de estado importantes nas stores.
   * @param {string} storeName - O nome da store (ex: 'useRunStore').
   * @param {string} key - A propriedade do estado que mudou (ex: 'gamePhase').
   * @param {*} from - O valor antigo.
   * @param {*} to - O novo valor.
   */
  logStateChange(storeName, key, from, to) {
    log(`State Change in <${storeName}>: '${key}'`, 'color: #f59e0b; font-weight: bold;', { from, to });
  },

  info(message, data) {
    log(message, 'color: #60a5fa;', data);
  },

  warn(message) {
    if (!DEBUG_MODE) return;
    console.warn(`${LOG_PREFIX} [WARN]`, message);
  },
};
