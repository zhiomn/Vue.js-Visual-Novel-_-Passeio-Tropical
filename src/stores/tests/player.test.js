import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePlayerStore } from '../player';

// Descrevemos a suíte de testes para a store 'player'
describe('usePlayerStore', () => {
  // `beforeEach` é um gancho do Vitest que é executado antes de CADA `it` block.
  // Isso garante que cada teste comece com um estado limpo e isolado.
  beforeEach(() => {
    // Cria uma nova instância da Pinia e a define como a ativa.
    setActivePinia(createPinia());
  });

  it('initializes with a default state', () => {
    const playerStore = usePlayerStore();
    expect(playerStore.runCount).toBe(0);
    expect(playerStore.unlockedEscolhaIds).toEqual([]);
    expect(playerStore.unlockedChoiceCount).toBe(0);
  });

  it('increments runCount when startNewRun is called', () => {
    // Arrange: Obtemos a instância da store.
    const playerStore = usePlayerStore();
    expect(playerStore.runCount).toBe(0); // Verifica o estado inicial

    // Act: Chamamos a ação que queremos testar.
    playerStore.startNewRun();

    // Assert: Verificamos se o estado foi modificado como esperado.
    expect(playerStore.runCount).toBe(1);

    // Testamos de novo para garantir que ele continua incrementando.
    playerStore.startNewRun();
    expect(playerStore.runCount).toBe(2);
  });

  it('unlocks a choice and updates the count', () => {
    const playerStore = usePlayerStore();
    expect(playerStore.unlockedChoiceCount).toBe(0);

    // Act
    playerStore.unlockChoice(5);

    // Assert
    expect(playerStore.unlockedEscolhaIds).toContain(5);
    expect(playerStore.unlockedEscolhaIds).toHaveLength(1);
    expect(playerStore.unlockedChoiceCount).toBe(1);
  });

  it('does not add a duplicate choice to unlockedEscolhaIds', () => {
    const playerStore = usePlayerStore();
    
    // Act: Chamamos a mesma ação duas vezes com o mesmo ID.
    playerStore.unlockChoice(10);
    playerStore.unlockChoice(10);

    // Assert: Verificamos se o ID foi adicionado apenas uma vez.
    expect(playerStore.unlockedEscolhaIds).toEqual([10]);
    expect(playerStore.unlockedChoiceCount).toBe(1);
  });
});
