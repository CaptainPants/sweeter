import { initializeDispatcher } from './extendArkTypes/dispatcher.js';
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

    await initializeDispatcher();
}

// This needs to happen before we do a real import
await extendArkTypes();
