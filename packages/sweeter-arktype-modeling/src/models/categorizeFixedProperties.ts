import { introspect } from '../type/index.js';
import {
    PropertyInfo,
    type AnyTypeConstraint,
    type UnknownObjectType,
} from '../type/types.js';

import { sortProperties } from './sortProperties.js';

export interface CategorizedPropertyDefinition {
    name: string | symbol;
    order?: number;
    propertyInfo: PropertyInfo;
}

/**
 * @param model
 * @returns
 */
export function categorizeFixedProperties(
    objectType: UnknownObjectType,
): Array<{ category: string; properties: CategorizedPropertyDefinition[] }>;

/**
 * @param model
 * @param transform
 * @returns
 */
export function categorizeFixedProperties<TPropertyResult>(
    objectType: UnknownObjectType,
    transform?: (property: CategorizedPropertyDefinition) => TPropertyResult,
): Array<{ category: string; properties: TPropertyResult[] }>;
export function categorizeFixedProperties(
    objectType: UnknownObjectType,
    transform?: (property: CategorizedPropertyDefinition) => unknown,
): Array<{ category: string; properties: unknown[] }> {
    const categoryMap = new Map<string, CategorizedPropertyDefinition[]>();

    for (const [name, propertyTyped] of introspect
        .getObjectTypeInfo(objectType)
        .getFixedProperties()) {
        const category =
            (propertyTyped.type.hasAnnotations()
                ? propertyTyped.type.annotations()?.category()
                : undefined) ?? 'Misc';

        let list = categoryMap.get(category);
        if (!list) {
            list = [];
            categoryMap.set(category, list);
        }

        list.push({ name, order: 0, propertyInfo: propertyTyped });
    }

    const keys = [...categoryMap.keys()];
    keys.sort();

    return keys.map((categoryName) => {
        const items = categoryMap.get(categoryName)!;
        const sorted = sortProperties(items);
        const mapped = sorted.map((x) => (transform ? transform(x) : x));

        return { category: categoryName, properties: mapped };
    });
}
