import { arrayRemove } from '../arrayRemove.js';

const strongReferences = new WeakMap<object, unknown[]>();

export function addExplicitStrongReference(from: object, to: unknown): void {
    const found = strongReferences.get(from);
    if (found) {
        found.push(to);
    } else {
        const toAdd = [to];
        strongReferences.set(from, toAdd);
    }
}

export function removeExplicitStrongReference(from: object, to: unknown): void {
    const found = strongReferences.get(from);
    if (found) {
        arrayRemove(found, to);
    }
}

export function hasExplicitStrongReference(from: object, to: unknown): boolean {
    const refs = strongReferences.get(from);
    if (refs) return refs.includes(to);
    return false;
}

const empty = Object.freeze([]);

export function getExplicitStrongReferencesFrom(from: object) {
    return strongReferences.get(from) ?? empty;
}
