import { z } from 'zod';
import { ContextualValueCalculationCallback, notFound } from '..';

const weakMap = new WeakMap<z.ZodType, MetaData<any>>();

export class MetaData<TZodType extends z.ZodTypeAny> {
    #attributes?: Map<string, unknown>;
    #labels?: Set<string>;
    #localValues?: Map<
        string,
        ContextualValueCalculationCallback<TZodType>
    > = new Map<string, ContextualValueCalculationCallback<TZodType>>();
    #ambientValues?: Map<
        string,
        ContextualValueCalculationCallback<TZodType>
    > = new Map<string, ContextualValueCalculationCallback<TZodType>>();

    public setAttr(schema: z.ZodType, name: string, value: unknown) {
        (this.#attributes ?? (this.#attributes = new Map())).set(name, value);
    }

    /**
     * 
     * @param schema 
     * @param name 
     * @returns symbol 'notFound' if not found
     */
    public getAttr(name: string): unknown {
        if (!this.#attributes) return notFound;

        if (!this.#attributes.has(name)) return notFound;

        return this.#attributes.get(name);
    }

    public setLabel(name: string, val: boolean) {
        const set = (this.#labels ?? (this.#labels = new Set()));
        
        if (val) {
            set.add(name);
        }
        else {
            set.delete(name);
        }
    }

    public hasLabel(name: string): boolean {
        if (!this.#labels) return false;

        return this.#labels.has(name);
    }
    
    public setLocalValue(name: string, value: ContextualValueCalculationCallback<TZodType> | undefined) {
        (this.#localValues ?? (this.#localValues = new Map())).set(name, value);
    }

    public getLocalValue(name: string): ContextualValueCalculationCallback<TZodType> | undefined {
        return this.#localValues?.get(name);
    }

    public setAmbientValue(name: string, value: ContextualValueCalculationCallback<TZodType> | undefined) {
        (this.#ambientValues ?? (this.#ambientValues = new Map())).set(name, value);
    }

    public getAmbientValue(name: string): ContextualValueCalculationCallback<TZodType> | undefined {
        return this.#ambientValues?.get(name);
    }

    public static tryGet<TZodType extends z.ZodTypeAny>(schema: TZodType): MetaData<TZodType> | undefined {
        return weakMap.get(schema);
    }

    public static get<TZodType extends z.ZodTypeAny>(schema: TZodType, createIfNotFound: boolean): MetaData<TZodType> {
        const item = weakMap.get(schema);
        if (item === undefined) {
            if (createIfNotFound) {
                const result = new MetaData<TZodType>();
                weakMap.set(schema, result);
                return result;
            }
            else {
                throw new Error('Metadata not found');
            }
        }
        return item;
    }

    public static getAttr<TZodType extends z.ZodTypeAny>(schema: TZodType, name: string): unknown | typeof notFound {
        return MetaData.tryGet(schema)?.getAttr(name) ?? notFound;
    }

    public static hasLabel<TZodType extends z.ZodTypeAny>(schema: TZodType, name: string): boolean {
        return MetaData.tryGet(schema)?.hasLabel(name) ?? false;
    }
};
