import { z } from 'zod';
import { notFound } from '..';

const weakMap = new WeakMap<z.ZodType, Map<string, unknown>>();

export const attributes = {
    set(schema: z.ZodType, key: string, value: unknown) {
        let map = weakMap.get(schema);

        if (!map) {
            map = new Map();
            weakMap.set(schema, map);
        }

        map.set(key, value);
    },
    get(schema: z.ZodType, key: string): unknown {
        const map = weakMap.get(schema);

        if (!map) return notFound;

        if (!map.has(key)) return notFound;

        return map.get(key);
    },
    has(schema: z.ZodType, key: string): boolean {
        const map = weakMap.get(schema);

        if (!map) return false;

        if (!map.has(key)) return false;

        return true;
    },
};
