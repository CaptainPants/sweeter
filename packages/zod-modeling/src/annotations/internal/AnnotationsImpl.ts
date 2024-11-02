import { z } from 'zod';
import {
    Annotations,
    arkTypeUtilityTypes,
    type ContextualValueCalculationCallback,
    type ContextualValueCalculationContext,
    type ReadonlySignalLike,
    serializeSchemaForDisplay,
} from '../../index.js';
import { descend } from '@captainpants/sweeter-utilities';
import { shallowMatchesStructure } from '../../utility/validate.js';
import { safeParse } from '../../utility/parse.js';
import { type } from 'arktype';

const weakMap = new WeakMap<arkTypeUtilityTypes.AnyTypeConstraint, AnnotationsImpl<any>>();

const schemas = {
    displayName: type.string,
    propertyCategory: type.string,
    propertyVisible: type.boolean,
};

export class AnnotationsImpl<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint>
    implements Annotations<TArkType>
{
    constructor(schema: TArkType) {
        this.#schema = schema;
    }

    #schema: TArkType;
    #attributes?: Map<string, unknown>;
    #labels?: Set<string>;
    #localValues?: Map<string, ContextualValueCalculationCallback<TArkType>> =
        new Map<string, ContextualValueCalculationCallback<TArkType>>();
    #ambientValues?: Map<string, ContextualValueCalculationCallback<TArkType>> =
        new Map<string, ContextualValueCalculationCallback<TArkType>>();

    public attr(name: string, value: unknown): this {
        (this.#attributes ?? (this.#attributes = new Map())).set(name, value);
        return this;
    }

    public getAttr(name: string, fallback: unknown): unknown {
        if (!this.#attributes) return fallback;
        if (!this.#attributes.has(name)) return fallback;

        return this.#attributes.get(name);
    }

    public getAttrValidated<TValueArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(
        name: string,
        valueSchema: TValueArkType,
        fallback: TValueArkType['infer'],
    ): TValueArkType['infer'] {
        if (!this.#attributes) return fallback;
        if (!this.#attributes.has(name)) return fallback;

        const value = this.#attributes.get(name);

        const parsed = safeParse(value, valueSchema);
        if (parsed.success) return parsed.data;
        return fallback;
    }

    public label(name: string, val: boolean = true): this {
        const set = this.#labels ?? (this.#labels = new Set());

        if (val) {
            set.add(name);
        } else {
            set.delete(name);
        }
        return this;
    }

    public hasLabel(name: string): boolean {
        if (!this.#labels) return false;

        return this.#labels.has(name);
    }

    public category(category: string | null): this;
    public category(): string | null;
    public category(
        category?: string | null | undefined,
    ): this | string | null {
        if (category === undefined) {
            return this.attr('property:category', category);
        }

        const res = this.getAttr('property:category', undefined);
        const parsed = safeParse(res, schemas.propertyCategory);
        if (parsed.success) {
            return parsed.data;
        }
        return null;
    }

    public displayName(): string | null;
    public displayName(displayName: string | null): this;
    public displayName(
        displayName?: string | undefined | null,
    ): this | string | null {
        if (displayName === undefined) {
            return this.attr('displayName', displayName);
        }

        const res = this.getAttr('displayName', undefined);
        const parsed = safeParse(res, schemas.displayName);
        if (parsed.success) {
            return parsed.data;
        }
        return null;
    }
    public getBestDisplayName(): string {
        const displayName = this.displayName();
        if (displayName) return displayName;
        return serializeSchemaForDisplay(this.#schema);
    }

    public visible(): boolean;
    public visible(visibility: boolean): this;
    public visible(visibility?: boolean): this | boolean {
        if (visibility === undefined) {
            return this.getAttrValidated(
                'property:visible',
                schemas.propertyVisible,
                true,
            );
        }

        return this.attr('property:visible', visibility);
    }

    public withLocalValue(
        name: string,
        callback: ContextualValueCalculationCallback<arkTypeUtilityTypes.AnyTypeConstraint>,
    ): this;
    public withLocalValue(name: string, value: unknown): this;
    public withLocalValue(name: string, callbackOrValue: unknown): this {
        (this.#localValues ?? (this.#localValues = new Map())).set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<arkTypeUtilityTypes.AnyTypeConstraint>)
                : () => callbackOrValue,
        );
        return this;
    }

    public withAmbientValue(
        name: string,
        callback: ContextualValueCalculationCallback<arkTypeUtilityTypes.AnyTypeConstraint>,
    ): this;
    public withAmbientValue(name: string, value: unknown): this;
    public withAmbientValue(name: string, callbackOrValue: unknown): this {
        (this.#ambientValues ?? (this.#ambientValues = new Map())).set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<arkTypeUtilityTypes.AnyTypeConstraint>)
                : () => callbackOrValue,
        );
        return this;
    }

    public getLocalValue(
        name: string,
        value: TArkType['infer'],
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
        if (
            !shallowMatchesStructure(
                this.#schema,
                value,
                true,
                descend.defaultDepth,
            )
        ) {
            throw new Error('Incorrect type value provided.');
        }

        return this.getLocalValue(name, value, context);
    }

    public getAmbientValue(
        name: string,
        value: ReadonlySignalLike<TArkType['infer']>,
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
        if (
            !shallowMatchesStructure(
                this.#schema,
                value,
                true,
                descend.defaultDepth,
            )
        ) {
            throw new Error('Incorrect type value provided.');
        }

        return this.getAmbientValue(name, value, context);
    }

    end(): TArkType {
        return this.#schema;
    }

    public static tryGet<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint>(
        schema: TArkType,
    ): AnnotationsImpl<TArkType> | undefined {
        return weakMap.get(schema);
    }

    public static get<TZodType extends arkTypeUtilityTypes.AnyTypeConstraint>(
        schema: TZodType,
        createIfNotFound: boolean,
    ): AnnotationsImpl<TZodType> {
        const item = weakMap.get(schema);
        if (item === undefined) {
            if (createIfNotFound) {
                const result = new AnnotationsImpl<TZodType>(schema);
                weakMap.set(schema, result);
                return result;
            } else {
                throw new Error('Metadata not found');
            }
        }
        return item;
    }
}
