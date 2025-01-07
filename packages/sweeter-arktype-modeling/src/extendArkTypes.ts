import { extendArkTypes_typeOnly } from './extendArkTypes/extendArkTypes_typeOnly.js';

let inited = false;

async function extendArkTypes(): Promise<void> {
    if (inited) {
        return;
    }
    inited = true;

    extendArkTypes_typeOnly();

    // This is dynamically imported so that that we don't load arktype fully until we are ready..
    const dispatcher_exports = await import('./extendArkTypes/dispatcher.js');
    await dispatcher_exports.initializeDispatcher();

    const extendArkTypes_concrete_exports = await import('./extendArkTypes/extendArkTypes_concrete.js');
    extendArkTypes_concrete_exports.extendArkTypes_concrete();
}

// This needs to happen before we do a real import
await extendArkTypes();
