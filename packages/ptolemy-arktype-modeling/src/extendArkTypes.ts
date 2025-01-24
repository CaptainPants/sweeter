import { extendArkTypes_typeOnly } from './extendArkTypes/extendArkTypes_typeOnly.js';
// Just so we import the interface extensions
import type {} from './extendArkTypes/globals.js';

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
}

// This needs to happen before we do a real import
await extendArkTypes();
