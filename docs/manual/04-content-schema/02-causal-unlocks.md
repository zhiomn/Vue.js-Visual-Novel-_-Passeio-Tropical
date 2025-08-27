# 4.2 Causal Unlock System

Beyond the primary progression system (total choices unlocking apps), "Tropical Versos" features a secondary, "causal" unlock system. This system creates a logical chain of discovery, where interacting with one piece of content directly unlocks another related piece.

This entire logic is managed within the **`readStatus.js` store**.

---

### The Core Principle

The system is triggered whenever an item is marked as "read" via the `readStatusStore.markAsRead(type, id)` action. Internally, a `processUnlocks` function checks the `type` and `id` of the consumed content and determines if it should trigger a subsequent unlock.

This creates a more immersive and logical discovery process for the player.

---

### The Unlock Chains

Here are the primary causal chains implemented in the game:

1.  **Note -> Gallery Item & Author Details**
    -   **Trigger:** Reading a poem in the **Anotações** (Notes) app. (`markAsRead('notes', 'note_1')`)
    -   **Action:** The system identifies the original `escolhaId` (e.g., `1`).
    -   **Unlocks:**
        1.  The corresponding magazine cover in the **Galeria** (Gallery) becomes visible. (`unlockedContent.gallery.add('gal_revista_1')`)
        2.  The full details (name, avatar) of the poem's author are revealed throughout the phone (e.g., in Messages, Contacts). (`unlockedContent.message_details.add('sandra_souza')`)

2.  **Gallery Item -> E-Reader Magazine**
    -   **Trigger:** Viewing a magazine cover for the first time in the **Galeria** (Gallery). (`markAsRead('gallery', 'gal_revista_1')`)
    -   **Action:** The system finds the `obraId` associated with that cover.
    -   **Unlocks:** The full PDF of that magazine becomes readable in the **Estante** (E-Reader) app. (`unlockedContent.ereader.add('tropicalzin_1')`)

3.  **Contact Details -> Map Location**
    -   **Trigger:** Reading an author's full profile in the **Contatos** (Contacts) app. (`markAsRead('contacts', 'sandra_souza')`)
    -   **Action:** The system looks up the `city_id` for that author.
    -   **Unlocks:** The author's home city becomes a visible pin on the **Mapa** (Map). (`unlockedContent.map_locations.add('colatina_es')`)

4.  **Scene Visit -> Painter Details**
    -   **Trigger:** Visiting a scene that has a painting as a background for the first time (starting in Run 2). (`readStatusStore.markSceneAsViewed('cena_colina')`)
    -   **Action:** The system identifies the `painterId` associated with that scene.
    -   **Unlocks:** The painter's details are revealed, adding them as a new entry in the **Contatos** app. (`unlockedContent.message_details.add('lev-lagorio')`)

This system ensures that the player's exploration feels interconnected and rewarding, as one discovery naturally leads to another.
