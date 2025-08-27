# Guia de Estilo e Dicionário

Este documento estabelece os padrões para a escrita da documentação de fluxo, garantindo consistência e clareza. É a fonte da verdade para toda a nossa sintaxe.

---

### Dicionário de Chaves de Metadados

As seguintes chaves podem ser usadas dentro de um bloco de metadados `---` em um arquivo de sequência.

---
### `<code class="cat-id">id</code>`
*   **Propósito:** Fornece um identificador único e obrigatório para um evento. É usado como alvo para a chave `wait`.
*   **Sintaxe:** `id: [PrefixoDaFase]-[SufixoDoPasso]`
*   **Exemplo Prático:**
    ```yaml
    id: F2-S3
    cat: UI
    ```
---
#### `<code class="cat-cat">cat</code>`
*   **Propósito:** Define a categoria do evento. Obrigatório. Deve ser um dos cinco valores do conjunto fechado (`GATILHO`, `UI`, `LÓGICA`, `ÁUDIO`, `SISTEMA`).
*   **Sintaxe:** `cat: [NOME_DA_CATEGORIA]`
*   **Exemplo Prático:**
    ```yaml
    cat: LÓGICA
    ```
---
#### `<code class="cat-dur">dur</code>`
*   **Propósito:** Define a **DURAÇÃO** de um evento (ex: a duração de um fade).
*   **Sintaxe:** `dur: [Tempo]` (ex: `2s`, `500ms`)
*   **Exemplo Prático:**
    ```yaml
    dur: 3s
    ```
---
#### `<code class="cat-delay">delay</code>`
*   **Propósito:** Define um **ATRASO** (delay) incondicional antes do início de um evento.
*   **Sintaxe:** `delay: [Tempo]`
*   **Exemplo Prático:**
    ```yaml
    delay: 0.5s
    ```
---
#### `<code class="cat-wait">wait</code>`
*   **Propósito:** Cria uma **DEPENDÊNCIA**. O evento só começará após a conclusão do evento referenciado pelo `id`.
*   **Sintaxe:** `wait: [id_do_outro_evento]`
*   **Exemplo Prático:**
    ```yaml
    wait: F2-S5
    ```
---
#### `<code class="cat-ref">ref</code>`
*   **Propósito:** Cria uma **REFERÊNCIA** a um documento de sistema mais detalhado.
*   **Sintaxe:** `ref: [CÓDIGO_DO_DOCUMENTO]`
*   **Exemplo Prático:**
    ```yaml
    ref: S-PER
    ```
