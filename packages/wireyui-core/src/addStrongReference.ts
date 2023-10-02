const strongReferences = new WeakMap<object, unknown[]>();

export function addStrongReference(node: object, ref: unknown): void {
    const found = strongReferences.get(node);
    if (found) {
        found.push(ref);
    } else {
        const toAdd = [ref];
        strongReferences.set(node, toAdd);
    }
}
