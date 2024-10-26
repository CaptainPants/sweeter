import { z } from 'zod';
import { ContextualValueCalculationCallback, ContextualValueCalculationContext, MetaData, ReadonlySignalLike, notFound } from '../..';
import { descend } from '@captainpants/sweeter-utilities';
import { shallowMatchesStructure } from '../../models/validate';

const weakMap = new WeakMap<z.ZodType, MetaDataImpl<any>>();

const schemas = {
    displayName: z.string(),
    propertyCategory: z.string(),
    propertyVisible: z.boolean()
}

export class MetaDataImpl<TZodType extends z.ZodTypeAny> implements MetaData<TZodType> {
    constructor(schema: TZodType) {
        this.#schema = schema;
    }

    #schema: TZodType;
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

    public setAttr(name: string, value: unknown): this {
        (this.#attributes ?? (this.#attributes = new Map())).set(name, value);
        return this;
    }

    public getAttr(name: string, fallback: unknown): unknown {
        if (!this.#attributes) return fallback;
        if (!this.#attributes.has(name)) return fallback;

        return this.#attributes.get(name);
    }

    public getAttrValidated<TValueZodType extends z.ZodTypeAny>(name: string, valueSchema: TValueZodType, fallback: z.infer<TValueZodType>): unknown {
        if (!this.#attributes) return fallback;
        if (!this.#attributes.has(name)) return fallback;

        const value = this.#attributes.get(name);

        const parsed = valueSchema.safeParse(value);
        if (parsed.success) return parsed.data;
        return fallback;
    }

    public withLabel(name: string, val: boolean = true): this {
        const set = (this.#labels ?? (this.#labels = new Set()));
        
        if (val) {
            set.add(name);
        }
        else {
            set.delete(name);
        }
        return this;
    }

    public hasLabel(name: string): boolean {
        if (!this.#labels) return false;

        return this.#labels.has(name);
    }
    
    public withCategory(category: string | undefined) {
        return this.setAttr('property:category', category);
    };

    public category(): string | undefined {
        const res = this.getAttr('property:category', undefined);
        const parsed = schemas.propertyCategory.safeParse(res);
        if (parsed.success) {
            return parsed.data
        }
        return undefined;
    };

    public visible(visibility: boolean) {
        this.setAttr('property:visible', visibility);
        return this;
    };

    public isVisible() {
        const res = this.getAttr('property:visible', false);
        const parsed = schemas.propertyVisible.safeParse(res);
        if (parsed.success) {
            return parsed.data
        }
        return true;
    };
    
    public withLocalValue(name: string, callback: ContextualValueCalculationCallback<any>): this;
    public withLocalValue(name: string, value: unknown): this;
    public withLocalValue(name: string, callbackOrValue: unknown): this {
        (this.#localValues ?? (this.#localValues = new Map())).set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<any>)
                : () => callbackOrValue,
        );
        return this;
    };
    
    public withAmbientValue(name: string, callback: ContextualValueCalculationCallback<any>): this;
    public withAmbientValue(name: string, value: unknown): this;
    public withAmbientValue(name: string, callbackOrValue: unknown): this {
        (this.#ambientValues ?? (this.#ambientValues = new Map())).set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<any>)
                : () => callbackOrValue,
        );
        return this;
    };

    public getLocalValue(
        name: string,
        value: z.infer<TZodType>,
        context: ContextualValueCalculationContext,
    ) {
        const found = this.#localValues?.get(name);

        if (!found) {
            return undefined;
        }

        return found(value, context);
    }

    public getLocalValueForUnknown(
        name: string,
        value: unknown,
        context: ContextualValueCalculationContext,
    ) {
        if (!shallowMatchesStructure(this.#schema, value, true, descend.defaultDepth)) {
            throw new Error('Incorrect type value provided.');
        }

        return this.getLocalValue(
            name,
            value,
            context,
        );
    }

    public getAmbientValue(
        name: string,
        value: ReadonlySignalLike<z.infer<TZodType>>,
        context: ContextualValueCalculationContext,
    ) {
        const found = this.#ambientValues?.get(name);

        if (!found) {
            return undefined;
        }

        return found(value, context);
    }

    public getAmbientValueForUnknown(
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ) {
        if (!shallowMatchesStructure(this.#schema, value, true, descend.defaultDepth)) {
            throw new Error('Incorrect type value provided.');
        }

        return this.getAmbientValue(
            name,
            value,
            context,
        );
    }

    endMeta(): TZodType {
        return this.#schema;
    }

    public static tryGet<TZodType extends z.ZodTypeAny>(schema: TZodType): MetaDataImpl<TZodType> | undefined {
        return weakMap.get(schema);
    }

    public static get<TZodType extends z.ZodTypeAny>(schema: TZodType, createIfNotFound: boolean): MetaDataImpl<TZodType> {
        const item = weakMap.get(schema);
        if (item === undefined) {
            if (createIfNotFound) {
                const result = new MetaDataImpl<TZodType>(schema);
                weakMap.set(schema, result);
                return result;
            }
            else {
                throw new Error('Metadata not found');
            }
        }
        return item;
    }
};
