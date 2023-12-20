import { type PropertyModel } from './PropertyModel.js';
import { sortProperties } from './sortProperties.js';

function groupBy<T>(
    properties: T[],
    getKey: (item: T) => string,
): Map<string, { key: string; items: T[] }> {
    const map = new Map<string, { key: string; items: T[] }>();

    for (const item of properties) {
        const key = getKey(item);

        let match = map.get(key);
        if (match === undefined) {
            match = { key, items: [] };
            map.set(key, match);
        }

        match.items.push(item);
    }

    return map;
}

/**
 * This function calls local values evaluation for the '$Visible' property, which is allowed to use signals - as such you should wrap any calls in a computed signal.
 * @param model
 * @param context
 * @param transform
 * @returns
 */
export function categorizeProperties<TProperty>(
    properties: Array<PropertyModel<unknown>>,
    transform: (value: PropertyModel<unknown>) => TProperty,
): Array<{ category: string; properties: TProperty[] }> {
    const map = groupBy(
        properties,
        (item) => item.definition.category ?? 'Misc',
    );

    const keys = [...map.keys()];
    keys.sort();
    return keys.map((x) => {
        const items = map.get(x)!.items;
        const sorted = sortProperties(items);
        const mapped = sorted.map((x) => transform(x));

        return { category: x, properties: mapped };
    });
}
