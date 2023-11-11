const strongReferences = new WeakMap<object, unknown[]>();

export function addExplicitStrongReference(
    node: object,
    referred: unknown,
): void {
    const found = strongReferences.get(node);
    if (found) {
        found.push(referred);
    } else {
        const toAdd = [referred];
        strongReferences.set(node, toAdd);
    }
}

export function hasExplicitStrongReference(
    node: object,
    referred: unknown,
): boolean {
    const refs = strongReferences.get(node);
    if (refs) return refs.includes(referred);
    return false;
}

const empty = Object.freeze([]);

export function getExplicitStrongReferencesFrom(node: object) {
    return strongReferences.get(node) ?? empty;
}
