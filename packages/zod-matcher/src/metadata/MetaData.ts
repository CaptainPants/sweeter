import { z } from 'zod';
import { ContextualValueCalculationCallback, ContextualValueCalculationContext, ReadonlySignalLike, notFound } from '..';
import { descend } from '@captainpants/sweeter-utilities';
import { shallowMatchesStructure } from '../models/validate';

const weakMap = new WeakMap<z.ZodType, MetaData<any>>();

const schemas = {
    displayName: z.string(),
    propertyCategory: z.string(),
    propertyVisible: z.boolean()
}

export interface MetaData<TZodType extends z.ZodTypeAny> {
    setAttr(name: string, value: unknown): this;

    getAttr(name: string, fallback: unknown): unknown;

    getAttrValidated<TValueZodType extends z.ZodTypeAny>(name: string, valueSchema: TValueZodType, fallback: z.infer<TValueZodType>): unknown;

    withLabel(name: string, val?: boolean): this;

    hasLabel(name: string): boolean ;
    
    withCategory(category: string | undefined): this;

    category(): string | undefined;

    visible(visibility: boolean): this;

    isVisible(): boolean;
    
    withLocalValue(name: string, callback: ContextualValueCalculationCallback<any>): this;
    withLocalValue(name: string, value: unknown): this;
    
    withAmbientValue(name: string, callback: ContextualValueCalculationCallback<any>): this;
    withAmbientValue(name: string, value: unknown): this;

    getLocalValue(
        name: string,
        value: z.infer<TZodType>,
        context: ContextualValueCalculationContext,
    ): unknown;

    getLocalValueForUnknown(
        name: string,
        value: unknown,
        context: ContextualValueCalculationContext,
    ): unknown;

    getAmbientValue(
        name: string,
        value: z.infer<TZodType>,
        context: ContextualValueCalculationContext,
    ): unknown;

    getAmbientValueForUnknown(
        name: string,
        value: unknown,
        context: ContextualValueCalculationContext,
    ): unknown;

    endMeta(): TZodType;
};
