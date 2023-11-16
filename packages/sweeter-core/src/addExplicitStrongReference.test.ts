import {
    addExplicitStrongReference,
    getExplicitStrongReferencesFrom,
    hasExplicitStrongReference,
} from './addExplicitStrongReference.js';

it('addExplicitStrongReference', () => {
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
