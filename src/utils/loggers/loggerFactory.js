import config from '@/data/config.json';

const DEBUG_MODE = config.debugMode;

function getCallerInfo() {
    try {
        throw new Error();
    } catch (e) {
        // Analisa a stack trace para encontrar o chamador
        const stackLines = e.stack.split('\n');
        // O índice 3 geralmente é o chamador da função de log (0=Error, 1=getCallerInfo, 2=log function)
        const callerLine = stackLines[3] || '';
        const match = callerLine.match(/at\s+(?:(\w+)\s+\()?(?:.*\/)?([\w\.]+\.js:\d+:\d+)/);
        if (match) {
            const functionName = match[1] || 'anonymous';
            const fileInfo = match[2];
            return `${fileInfo} (${functionName})`;
        }
        return 'unknown';
    }
}


export function createLogger(prefix, color) {
  if (!DEBUG_MODE) {
    return {
      log: () => {},
      warn: () => {},
      error: () => {},
      group: () => {},
      groupEnd: () => {},
      logState: () => {},
    };
  }

  const prefixStyle = `background-color: ${color}; color: #111; font-weight: bold; padding: 2px 6px; border-radius: 4px;`;
  const messageStyle = 'color: inherit;';
  const callerStyle = 'color: #888; font-style: italic; font-size: 0.8em;';

  function logMessage(level, message, data) {
    const callerInfo = getCallerInfo();
    const logFunc = console[level] || console.log;

    if (data !== undefined) {
      logFunc(`%c${prefix}%c ${message}\n%c@ ${callerInfo}`, prefixStyle, messageStyle, callerStyle, data);
    } else {
      logFunc(`%c${prefix}%c ${message}\n%c@ ${callerInfo}`, prefixStyle, messageStyle, callerStyle);
    }
  }
  
  return {
    log(message, data) { logMessage('log', message, data); },
    warn(message, data) { logMessage('warn', `[WARN] ${message}`, data); },
    error(message, data) { logMessage('error', `[ERROR] ${message}`, data); },
    group(title) { console.group(`%c${prefix}%c ${title}`, prefixStyle, messageStyle); },
    groupEnd() { console.groupEnd(); },
    logState(storeName, stateObject) {
        console.groupCollapsed(`%c${prefix}%c State Snapshot: ${storeName}`, prefixStyle, 'font-weight: bold;');
        console.table(stateObject);
        console.groupEnd();
    }
  };
}
