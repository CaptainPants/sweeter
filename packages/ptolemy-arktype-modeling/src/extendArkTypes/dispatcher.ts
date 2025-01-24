import { type AnnotationDispatcher } from './types.js';

export let dispatcher: AnnotationDispatcher;

export async function initializeDispatcher(): Promise<void> {
    dispatcher = await import('./AnnotationDispatcherImpl.js').then(
        (x) => new x.AnnotationDispatcherImpl(),
    );
}
