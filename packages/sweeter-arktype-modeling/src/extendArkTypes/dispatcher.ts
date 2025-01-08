import { type AnnotationDispatcher } from './types';

export let dispatcher: AnnotationDispatcher;

export async function initializeDispatcher(): Promise<void> {
    dispatcher = await import('./AnnotationDispatcherImpl').then(
        (x) => new x.AnnotationDispatcherImpl(),
    );
}
