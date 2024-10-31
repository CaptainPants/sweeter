export interface PropertyConstraint {
    readonly name: string;
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

    // TODO: property order overrides
    return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
}

export function sortProperties<TProp extends PropertyConstraint>(
    properties: readonly TProp[],
): readonly TProp[] {
    const copy = properties.slice();
    copy.sort(compareProperties);
    return copy;
}
