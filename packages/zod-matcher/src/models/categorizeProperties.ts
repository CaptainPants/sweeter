import {
    type UnknownRigidObjectType,
    type UnknownPropertyDefinition,
} from '../index.js';
import { sortProperties } from './sortProperties.js';

export interface CategorizedPropertyDefinition {
    name: string;
    order?: number;
    definition: UnknownPropertyDefinition;
}

/**
 * @param model
 * @returns
 */
export function categorizeProperties(
    type: UnknownRigidObjectType,
): Array<{ category: string; properties: CategorizedPropertyDefinition[] }>;

/**
 * @param model
 * @param transform
 * @returns
 */
export function categorizeProperties<TPropertyResult>(
    type: UnknownRigidObjectType,
    transform?: (property: CategorizedPropertyDefinition) => TPropertyResult,
): Array<{ category: string; properties: TPropertyResult[] }>;

export function categorizeProperties(
    type: UnknownRigidObjectType,
    transform?: (property: CategorizedPropertyDefinition) => unknown,
): Array<{ category: string; properties: unknown[] }> {
    const categoryMap = new Map<string, CategorizedPropertyDefinition[]>();

    for (const [name, property] of Object.entries(type.propertyDefinitions)) {
        const category = property.category ?? 'Misc';

        let list = categoryMap.get(category);
        if (!list) {
            list = [];
            categoryMap.set(category, list);
        }

        list.push({ name, order: 0, definition: property });
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
