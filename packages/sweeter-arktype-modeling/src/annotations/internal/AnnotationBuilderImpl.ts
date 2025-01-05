import {
    type AnnotationsBuilder,
    type ContextualValueCalculationCallback,
} from '../../index.js';

import {
    StandardAssociatedValueKeys,
    StandardAttributes
} from '../../annotations/StandardValues.js';

export class AnnotationsBuilderImpl implements AnnotationsBuilder {
    constructor(
        attributes: Map<string, unknown> | undefined,
        labels: Set<string> | undefined,
        associatedValues:
            | Map<string, ContextualValueCalculationCallback>
            | undefined,
        ambientValues:
            | Map<string, ContextualValueCalculationCallback>
            | undefined,
    ) {
        this.attributes = attributes;
        this.labels = labels;
        this.associatedValues = associatedValues;
        this.ambientValues = ambientValues;
    }

    attributes?: Map<string, unknown> | undefined;
    labels?: Set<string> | undefined;
    associatedValues?:
        | Map<string, ContextualValueCalculationCallback>
        | undefined;
    ambientValues?: Map<string, ContextualValueCalculationCallback> | undefined;

    public attr(name: string, value: unknown): this {
        (this.attributes ?? (this.attributes = new Map())).set(name, value);
        return this;
    }

    public label(name: string, val: boolean = true): this {
        const set = this.labels ?? (this.labels = new Set());

        if (val) {
            set.add(name);
        } else {
            set.delete(name);
        }
        return this;
    }

    public category(category?: string | null | undefined): this {
        return this.attr(StandardAttributes.property_category, category);
    }

    public displayName(displayName: string | undefined | null): this {
        return this.attr(StandardAttributes.displayName, displayName);
    }

    public visible(visibility: boolean): this {
        return this.withAssociatedValue(StandardAssociatedValueKeys.property_visible, visibility);
    }

    public withAssociatedValue(
        name: string,
        callback: ContextualValueCalculationCallback,
    ): this;
    public withAssociatedValue(name: string, value: unknown): this;
    public withAssociatedValue(name: string, callbackOrValue: unknown): this {
        (this.associatedValues ?? (this.associatedValues = new Map())).set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback)
                : () => callbackOrValue,
        );
        return this;
    }

    public withAmbientValue(
        name: string,
        callback: ContextualValueCalculationCallback,
    ): this;
    public withAmbientValue(name: string, value: unknown): this;
    public withAmbientValue(name: string, callbackOrValue: unknown): this {
        (this.ambientValues ?? (this.ambientValues = new Map())).set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback)
                : () => callbackOrValue,
        );
        return this;
    }

    public static empty(): AnnotationsBuilderImpl {
        return new AnnotationsBuilderImpl(
            undefined,
            undefined,
            undefined,
            undefined,
        );
    }
}
