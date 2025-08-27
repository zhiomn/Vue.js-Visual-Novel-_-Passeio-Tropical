import { describe, it, expect } from 'vitest';
import { getStartingSequence } from '../start';
import iniciosData from '@/data/inicios.json';

// Os testes são organizados em "suítes" com `describe`
describe('getStartingSequence', () => {
  // Cada `it` (ou `test`) é um caso de teste específico
  it('should return the correct sequence for Run 1', () => {
    // Preparação (Arrange): Nenhuma necessária para esta função pura.

    // Ação (Act): Chamamos a função que queremos testar.
    const result = getStartingSequence(1);

    // Afirmação (Assert): Verificamos se o resultado é o esperado.
    // 'expect' é a função principal de asserção do Vitest.
    expect(result).toBeDefined(); // Garante que o resultado não é nulo/undefined
    expect(result.id).toBe('inicio_1');
    expect(result.nome).toBe('Quarto');
    expect(result).toEqual(iniciosData[0]); // Compara o objeto inteiro com os dados da fonte
  });

  it('should return the correct sequence for Run 3', () => {
    const result = getStartingSequence(3);
    expect(result).toBeDefined();
    expect(result.id).toBe('inicio_3');
    expect(result).toEqual(iniciosData[2]);
  });

  it('should return null for a run that does not exist', () => {
    // Testamos um caso de falha esperado
    const result = getStartingSequence(99);
    expect(result).toBeNull();
  });
});
