
import { z } from 'zod';

const weakMap = new WeakMap<z.ZodType, Set<string>>();

export const labels = {
    set(schema: z.ZodType, name: string, val: boolean) {
        let set = weakMap.get(schema);

        if (!set) {
            set = new Set();
            weakMap.set(schema, set);
        }

        if (val) {
            set.add(name);
        }
        else {
            set.delete(name);
        }
    },
    has(schema: z.ZodType, key: string): boolean {
        const map = weakMap.get(schema);

        if (!map) return false;
        if (!map.has(key)) return false;

        return true;
    }
}