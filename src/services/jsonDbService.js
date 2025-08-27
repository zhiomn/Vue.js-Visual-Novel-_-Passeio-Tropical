/**
 * @file The single source of truth for accessing raw game data from JSON files.
 * No other file in the application should import directly from /data/*.json.
 */

import actionsData from '@/data/actions.json';
import aisData from '@/data/ais.json';
import appsData from '@/data/apps.json';
import cenasData from '@/data/cenas.json';
import cidadesData from '@/data/cidades.json';
import escolhasData from '@/data/escolhas.json';
import finaisData from '@/data/finais.json';
import iniciosData from '@/data/inicios.json';
import obrasData from '@/data/obras.json';
import pessoasData from '@/data/pessoas.json';
import requirementsData from '@/data/requirements.json';
import textosData from '@/data/textos.json';
import { logger } from '@/utils/logger';

export const jsonDbService = {
  // --- GET ALL ---
  getAllActions: () => actionsData,
  getAllAis: () => aisData,
  getAllApps: () => appsData,
  getAllCenas: () => cenasData,
  getAllCidades: () => cidadesData,
  getAllEscolhas: () => escolhasData,
  getAllFinais: () => finaisData,
  getAllInicios: () => iniciosData,
  getAllObras: () => obrasData,
  getAllPessoas: () => pessoasData,
  getAllRequirements: () => requirementsData,
  getAllTextos: () => textosData,

  // --- FIND BY ID / KEY ---
  findCenaByName: (name) => cenasData.find(c => c.nome === name),
  findEscolhaById: (id) => escolhasData.find(e => e.id === id),
  findTextoById: (id) => textosData.find(t => t.id === id),
  findPessoaById: (id) => pessoasData.find(p => p.id === id),
  findObraById: (id) => obrasData.find(o => o.id === id),
  findCidadeById: (id) => cidadesData.find(c => c.id === id),

  // --- COMPLEX QUERIES ---
  getStartingSequenceByRun: (runCount) => {
    // --- THE BUG FIX IS HERE ---
    // Added the missing logger call to restore observability.
    const context = { runCount };
    logger.logDataQuery('jsonDbService.getStartingSequenceByRun', context);
    return iniciosData[runCount - 1] || null;
  },
  getEndingSequenceByRun: (completedRunCount) => finaisData.find(f => f.id === `final_run_${completedRunCount}`) || null,
  
  getStartActionsForRun: (runCount) => actionsData.filter(action =>
    action.context.phase === 'STARTING' && action.context.run === runCount
  ),

  getSceneActions: (sceneName) => actionsData.filter(action =>
    action.context.phase === 'EXPLORING' && action.context.scene === sceneName
  ),

  getAvailableChoicesForScene: (sceneName, unlockedEscolhaIds) => {
    return escolhasData.filter(e =>
      e.cena === sceneName && !unlockedEscolhaIds.includes(e.id)
    );
  },

  getTravelOptions: (visitedScenes) => {
    const available = cenasData.filter(c => !visitedScenes.includes(c.nome));
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2).map(s => s.nome);
  },
  
  getRandomScene: (visitedScenes) => {
    const availableScenes = cenasData.filter(c => !visitedScenes.includes(c.nome));
    if (availableScenes.length === 0) return null;
    return availableScenes[Math.floor(Math.random() * availableScenes.length)];
  },
};
