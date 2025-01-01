import {
    addExplicitStrongReference,
    getExplicitStrongReferencesFrom,
    hasExplicitStrongReference,
    removeExplicitStrongReference,
} from './addExplicitStrongReference.js';

it('registers correctly', () => {
    const refers = {};
    const referred = {};

    expect(hasExplicitStrongReference(refers, referred)).toStrictEqual(false);

    addExplicitStrongReference(refers, referred);

    expect(hasExplicitStrongReference(refers, referred)).toStrictEqual(true);

    // If the referred object is reachable from the refers object, then it must have a strong reference
    // which is the whole point of addExplicitReference
    const references = getExplicitStrongReferencesFrom(refers);
    expect(references).toStrictEqual([refers]);
});

it('correctly blocks collection', async () => {
    let target: { target: 2 } | undefined = { target: 2 };

    const weakRef = new WeakRef(target);

    const referencer = { references: 1 };

    addExplicitStrongReference(referencer, target);

    target = undefined; // This is our only root pointing to the target object

    await global.gc?.({ execution: 'async', type: 'major' });

    // But there is a single explicit strong reference so it shouldn't be collected

    expect(weakRef.deref()).not.toStrictEqual(undefined);

    removeExplicitStrongReference(referencer, weakRef.deref()); // Remove the only strong reference

    await global.gc?.({ execution: 'async', type: 'major' });

    // And it should be collected
    
    expect(weakRef.deref()).toStrictEqual(undefined);
});


