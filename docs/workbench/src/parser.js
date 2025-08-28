export function parseXState(fileContent) {
    const nodes = [];
    const edges = [];
    const statesRegex = /states:\s*\{([\s\S]*?)\s*\}\s*,?\s*\}/;
    const statesMatch = fileContent.match(statesRegex);

    if (!statesMatch) throw new Error("Could not find 'states' definition.");
    
    const statesContent = statesMatch[1];
    const stateRegex = /(\w+):\s*(\{[\s\S]*?\})/g;
    let match;

    while ((match = stateRegex.exec(statesContent)) !== null) {
        const stateName = match[1];
        const stateContent = match[2];
        const isFinal = /type:\s*['"]final['"]/.test(stateContent);
        
        const references = [];
        const actionsRegex = /(actions|actors):\s*\[?\s*['"](\w+)['"]/g;
        let refMatch;
        while ((refMatch = actionsRegex.exec(stateContent)) !== null) {
            references.push(refMatch[2]);
        }
        
        nodes.push({ id: stateName, label: stateName, type: 'state', code: stateContent, references, width: 150, height: 50, isFinal });

        const onRegex = /on:\s*\{([\s\S]*?)\}/;
        const onMatch = stateContent.match(onRegex);
        if (onMatch) {
            const eventRegex = /(\w+):\s*\{[\s\S]*?target:\s*['"](\w+)['"][\s\S]*?\}/g;
            let eventMatch;
            while ((eventMatch = eventRegex.exec(onMatch[1])) !== null) {
                 edges.push({ id: `${stateName}-${eventMatch[1]}-${eventMatch[2]}`, source: stateName, target: eventMatch[2], label: eventMatch[1] });
            }
            const simpleEventRegex = /(\w+):\s*['"](\w+)['"]/g;
             while ((eventMatch = simpleEventRegex.exec(onMatch[1])) !== null) {
                 edges.push({ id: `${stateName}-${eventMatch[1]}-${eventMatch[2]}`, source: stateName, target: eventMatch[2], label: eventMatch[1] });
            }
        }
    }
    return { nodes, edges };
}

export function parsePiniaStore(fileContent) {
    const nodes = [];
    const edges = [];

    const storeNameMatch = fileContent.match(/defineStore\(\s*['"](\w+)['"]/);
    const storeName = storeNameMatch ? storeNameMatch[1] : 'Pinia Store';
    
    const rootNode = { id: storeName, label: storeName, type: 'storeRoot', code: `defineStore('${storeName}', ... )`, width: 200, height: 60 };
    nodes.push(rootNode);

    const actionsRegex = /actions:\s*\{([\s\S]*?)\s*\}\s*,?\s*\}/;
    const actionsMatch = fileContent.match(actionsRegex);

    if (actionsMatch) {
        const actionsContent = actionsMatch[1];
        const actionRegex = /(\w+)\s*\(([\s\S]*?)\)\s*(\{[\s\S]*?\})/g;
        let match;
        while ((match = actionRegex.exec(actionsContent)) !== null) {
            const actionName = match[1];
            const params = match[2].trim();
            const codeBlock = match[3];
            const fullLabel = params ? `${actionName}(${params})` : `${actionName}()`;
            const actionNode = { id: actionName, label: fullLabel, type: 'action', code: codeBlock, width: 220, height: 50 };
            nodes.push(actionNode);
            edges.push({ id: `edge-${storeName}-${actionName}`, source: storeName, target: actionNode.id, label: 'has action' });
        }
    }
    
    return { nodes, edges };
}
