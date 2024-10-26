import { z } from 'zod';
import { MetaData } from './MetaData';
import { ContextualValueCalculationCallback, ContextualValueCalculationContext, ReadonlySignalLike } from '..';
import { shallowMatchesStructure } from '../models/validate';
import { descend } from '@captainpants/sweeter-utilities';

declare module 'zod' {
    interface ZodType<Output = any, Def extends z.ZodTypeDef = z.ZodTypeDef, Input = Output> {
        withAttr<T extends z.ZodTypeAny>(
            this: T,
            key: string,
            value: unknown,
        ): this;
        getAttr<T extends z.ZodTypeAny>(this: T, key: string): unknown;

        withLabel<T extends z.ZodTypeAny>(this: T, label: string): this;
        removeLabel<T extends z.ZodTypeAny>(this: T, label: string): this;
        hasLabel<T extends z.ZodTypeAny>(this: T, name: string): boolean;
        
        withCategory<T extends z.ZodTypeAny>(this: T, name: string): this;
        category<T extends z.ZodTypeAny>(this: T): string | undefined;

        visible<T extends z.ZodTypeAny>(this: T, visibility: boolean): this;
        isVisible<T extends z.ZodTypeAny>(this: T): boolean;
        
        withLocalValue(
            name: string,
            callback: ContextualValueCalculationCallback<this>,
        ): this;
        withLocalValue(name: string, value: unknown): this;
        getLocalValue(
            name: string,
            value: ReadonlySignalLike<Output>,
            context: ContextualValueCalculationContext,
        ): unknown;
        getLocalValueForUnknown(
            name: string,
            value: ReadonlySignalLike<Output>,
            context: ContextualValueCalculationContext,
        ): unknown;

        withAmbientValue(
            name: string,
            callback: ContextualValueCalculationCallback<this>,
        ): this;
        withAmbientValue(name: string, value: unknown): this;
        getAmbientValue(
            name: string,
            value: ReadonlySignalLike<Output>,
            context: ContextualValueCalculationContext,
        ): unknown;
        getAmbientValueForUnknown(
            name: string,
            value: ReadonlySignalLike<Output>,
            context: ContextualValueCalculationContext,
        ): unknown;
    }
}

const categorySchema = z.string();
const visibleSchema = z.boolean();

export function extendZodWithMetadataAttributes(zod: typeof z) {
    zod.ZodType.prototype.withAttr = function (name, value) {
        MetaData.get(this, true).setAttr(this, name, value);
        return this;
    };

    zod.ZodType.prototype.getAttr = function (name) {
        return MetaData.getAttr(this, name);
    };

    zod.ZodType.prototype.withLabel = function (name) {
        MetaData.get(this, true).setLabel(name, true);
        return this;
    };

    zod.ZodType.prototype.removeLabel = function (name) {
        MetaData.get(this, true).setLabel(name, false);
        return this;
    };

    zod.ZodType.prototype.hasLabel = function (name) {
        return MetaData.hasLabel(this, name);
    };

    zod.ZodType.prototype.withCategory = function (category) {
        MetaData.get(this, true).setAttr(this, 'property:category', category);
        return this;
    };

    zod.ZodType.prototype.category = function () {
        const res = MetaData.getAttr(this, 'property:category');
        const parsed = categorySchema.safeParse(res);
        if (parsed.success) {
            return parsed.data
        }
        return undefined;
    };

    zod.ZodType.prototype.visible = function (visibility: boolean) {
        MetaData.get(this, true).setAttr(this, 'property:visible', visibility);
        return this;
    };

    zod.ZodType.prototype.isVisible  = function () {
        const res = MetaData.getAttr(this, 'property:visible');
        const parsed = visibleSchema.safeParse(res);
        if (parsed.success) {
            return parsed.data
        }
        return true;
    };
    
    zod.ZodType.prototype.withLocalValue  = function (name, callbackOrValue) {
        MetaData.get(this, true).setLocalValue(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<any>)
                : () => callbackOrValue,
        );
        return this;
    };
    
    zod.ZodType.prototype.withAmbientValue  = function (name, callbackOrValue) {
        MetaData.get(this, true).setAmbientValue(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<any>)
                : () => callbackOrValue,
        );
        return this;
    };

    zod.ZodType.prototype.getLocalValue  = function (
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ) {
        const found = MetaData.get(this, true).getLocalValue(name);

        if (!found) {
            return undefined;
        }

        return found(value, context);
    }

    zod.ZodType.prototype.getLocalValueForUnknown  = function (
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ) {
        if (!shallowMatchesStructure(this, value, true, descend.defaultDepth)) {
            throw new Error('Incorrect type value provided.');
        }

        return this.getLocalValue(
            name,
            value as ReadonlySignalLike<any>,
            context,
        );
    }

    zod.ZodType.prototype.getAmbientValue  = function (
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ) {
        const found = MetaData.get(this, true).getAmbientValue(name);

        if (!found) {
            return undefined;
        }

        return found(value, context);
    }

    zod.ZodType.prototype.getAmbientValueForUnknown  = function (
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ) {
        if (!shallowMatchesStructure(this, value, true, descend.defaultDepth)) {
            throw new Error('Incorrect type value provided.');
        }

        return this.getAmbientValue(
            name,
            value as ReadonlySignalLike<any>,
            context,
        );
    }
}
