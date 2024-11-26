export interface PropertyConstraint {
    readonly name: string | symbol;
    readonly order?: number | undefined;
}

function compareProperties(
    a: PropertyConstraint,
    b: PropertyConstraint,
): number {
    const orderDifferent = (b.order ?? 0) - (a.order ?? 0);

    if (orderDifferent !== 0) {
        return orderDifferent;
    }

    const aType = typeof a.name === 'symbol' ? -1 : 1;
    const bType = typeof b.name === 'symbol' ? -1 : 1;
    if (aType !== bType) {
        return aType < bType ? -1 : 1;
    }

    // string.toString() is a no-op, if its a symbol it will be a mangled name
    const aName = a.name.toString();
    const bName = b.name.toString();

    // TODO: property order overrides
    return aName > bName ? 1 : aName === bName ? 0 : -1;
}

export function sortProperties<TProp extends PropertyConstraint>(
    properties: readonly TProp[],
): readonly TProp[] {
    const copy = properties.slice();
    copy.sort(compareProperties);
    return copy;
}
