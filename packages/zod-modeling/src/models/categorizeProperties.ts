import { type z } from 'zod';
import { sortProperties } from './sortProperties.js';

export interface CategorizedPropertyDefinition {
    name: string;
    order?: number;
    propertyType: z.ZodTypeAny;
}

/**
 * @param model
 * @returns
 */
export function categorizeProperties(
    objectType: z.AnyZodObject,
): Array<{ category: string; properties: CategorizedPropertyDefinition[] }>;

/**
 * @param model
 * @param transform
 * @returns
 */
export function categorizeProperties<TPropertyResult>(
    objectType: z.AnyZodObject,
    transform?: (property: CategorizedPropertyDefinition) => TPropertyResult,
): Array<{ category: string; properties: TPropertyResult[] }>;

export function categorizeProperties(
    objectType: z.AnyZodObject,
    transform?: (property: CategorizedPropertyDefinition) => unknown,
): Array<{ category: string; properties: unknown[] }> {
    const categoryMap = new Map<string, CategorizedPropertyDefinition[]>();

    for (const [name, property] of Object.entries(objectType.shape)) {
        const propertyTyped = property as z.ZodTypeAny;

        const category =
            (propertyTyped.hasAnnotations()
                ? propertyTyped.meta().category()
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
