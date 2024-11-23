import { AnyObjectTypeConstraint } from '../type/AnyObjectTypeConstraint.js';
import { AnyTypeConstraint } from '../type/AnyTypeConstraint.js';
import { introspect } from '../type/index.js';
import { sortProperties } from './sortProperties.js';

export interface CategorizedPropertyDefinition {
    name: string;
    order?: number;
    propertyType: AnyTypeConstraint;
}

/**
 * @param model
 * @returns
 */
export function categorizeProperties(
    objectType: AnyObjectTypeConstraint,
): Array<{ category: string; properties: CategorizedPropertyDefinition[] }>;

/**
 * @param model
 * @param transform
 * @returns
 */
export function categorizeProperties<TPropertyResult>(
    objectType: AnyObjectTypeConstraint,
    transform?: (property: CategorizedPropertyDefinition) => TPropertyResult,
): Array<{ category: string; properties: TPropertyResult[] }>;
export function categorizeProperties(
    objectType: AnyObjectTypeConstraint,
    transform?: (property: CategorizedPropertyDefinition) => unknown,
): Array<{ category: string; properties: unknown[] }> {
    const categoryMap = new Map<string, CategorizedPropertyDefinition[]>();

    for (const [name, propertyTyped] of introspect.getObjectTypeInfo(objectType)
        .fixedProps) {
        const category =
            (propertyTyped.hasAnnotations()
                ? propertyTyped.annotations()?.category()
                : undefined) ?? 'Misc';

        let list = categoryMap.get(category);
        if (!list) {
            list = [];
            categoryMap.set(category, list);
        }

        list.push({ name, order: 0, propertyType: propertyTyped });
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
