import { z } from "zod";

declare module 'zod' {
    interface ZodType {
        withAttr<T extends z.ZodTypeAny>(this: T, key: string, value: unknown): this;
        getAttr<T extends z.ZodTypeAny>(this: T, key: string): unknown;
        withLabel<T extends z.ZodTypeAny>(this: T, label: string): this;
        removeLabel<T extends z.ZodTypeAny>(this: T, label: string): this;
        hasLabel<T extends z.ZodTypeAny>(this: T, name: string): boolean;
    }
}