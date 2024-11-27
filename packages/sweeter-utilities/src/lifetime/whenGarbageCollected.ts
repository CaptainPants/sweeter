
const finalizationRegistry = new FinalizationRegistry<() => void>(
    callback => {
        callback();
    }
);

export function whenGarbageCollected(
    lifetimeObject: object,
    callback: () => void
) {
    finalizationRegistry.register(lifetimeObject, callback);
}
