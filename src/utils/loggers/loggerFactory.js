import config from '@/data/config.json';

const DEBUG_MODE = config.debugMode;

// Função para converter uma cor hexadecimal em RGBA com baixa opacidade
function hexToRgba(hex, alpha = 0.1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function createLogger(prefix, color) {
  if (!DEBUG_MODE) {
    return {
      log: () => {},
      warn: () => {},
      error: () => {},
      group: () => {},
      groupEnd: () => {},
    };
  }

  // Estilo para o prefixo [NomeDoManager]
  const prefixStyle = `
    background-color: ${hexToRgba(color, 0.15)};
    color: ${color};
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid ${hexToRgba(color, 0.3)};
  `;

  // Estilo para o resto da mensagem
  const messageStyle = 'color: inherit;';

  function logMessage(level, message, data) {
    const logFunc = console[level] || console.log;
    if (data !== undefined) {
      logFunc(`%c${prefix}%c ${message}`, prefixStyle, messageStyle, data);
    } else {
      logFunc(`%c${prefix}%c ${message}`, prefixStyle, messageStyle);
    }
  }

  return {
    log(message, data) {
      logMessage('log', message, data);
    },
    warn(message, data) {
      logMessage('warn', `[WARN] ${message}`, data);
    },
    error(message, data) {
      logMessage('error', `[ERROR] ${message}`, data);
    },
    group(title) {
      // MUDANÇA: Usar console.group para começar expandido
      console.group(`%c${prefix}%c ${title}`, prefixStyle, messageStyle);
    },
    groupEnd() {
      console.groupEnd();
    }
  };
}
