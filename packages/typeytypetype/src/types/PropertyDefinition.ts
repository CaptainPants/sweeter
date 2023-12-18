import {
    type ContextualValueCalculationCallback,
    type ContextualValueCalculationContext,
    StandardLocalValues,
} from '../ContextualValues.js';
import { type ReadonlySignalLike } from '../ReadonlySignalLike.js';

import { type Type } from './Type.js';

export class PropertyDefinition<TValue> {
    public constructor(type: Type<TValue>) {
        this.type = type;
    }

    public displayName?: string;
    public category?: string;
    public type: Type<TValue>;

    public readonly localValues: Map<
        string,
        ContextualValueCalculationCallback<Record<string, unknown>>
    > = new Map<
        string,
        ContextualValueCalculationCallback<Record<string, unknown>>
    >();

    public readonly ambientValues: Map<
        string,
        ContextualValueCalculationCallback<Record<string, unknown>>
    > = new Map<
        string,
        ContextualValueCalculationCallback<Record<string, unknown>>
    >();

    public withDisplayName(displayName: string): this {
        this.displayName = displayName;
        return this;
    }

    public withCategory(category: string): this {
        this.category = category;
        return this;
    }

    public withVisibility(
        visible:
            | boolean
            | ContextualValueCalculationCallback<Record<string, unknown>>,
    ): this {
        this.withLocalValue(StandardLocalValues.Visible, visible);
        return this;
    }

    public withLocalValue(
        name: string,
        callback: ContextualValueCalculationCallback<Record<string, unknown>>,
    ): this;
    public withLocalValue(name: string, value: unknown): this;
    public withLocalValue(
        name: string,
        callbackOrValue:
            | ContextualValueCalculationCallback<Record<string, unknown>>
            | unknown,
    ): this {
        this.localValues.set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<
                      Record<string, unknown>
                  >)
                : () => callbackOrValue,
        );
        return this;
    }

    public withAmbientValue(
        name: string,
        callback: ContextualValueCalculationCallback<Record<string, unknown>>,
    ): this;
    public withAmbientValue(name: string, value: unknown): this;
    public withAmbientValue(
        name: string,
        callbackOrValue:
            | ContextualValueCalculationCallback<Record<string, unknown>>
            | unknown,
    ): this {
        this.ambientValues.set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<
                      Record<string, unknown>
                  >)
                : () => callbackOrValue,
        );
        return this;
    }

    public getAmbientValue(
        name: string,
        owner: ReadonlySignalLike<Readonly<Record<string, unknown>>>,
        context: ContextualValueCalculationContext,
    ): unknown {
        const found = this.ambientValues.get(name);

        if (!found) {
            return undefined;
        }

        return {
            exists: true,
            getValue: () => found(owner, context),
        };
    }

    public getLocalValue(
        name: string,
        owner: ReadonlySignalLike<Readonly<Record<string, unknown>>>,
        context: ContextualValueCalculationContext,
    ): unknown {
        const found = this.localValues.get(name);

        if (!found) {
            return undefined;
        }

        return found(owner, context);
    }
}
