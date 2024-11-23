import {
    AnnotationsBuilder,
    type AnyTypeConstraint,
    type ContextualValueCalculationCallback,
} from '../../index.js';

export class AnnotationsBuilderImpl<TSchema extends AnyTypeConstraint>
    implements AnnotationsBuilder
{
    constructor(
        attributes: Map<string, unknown> | undefined,
        labels: Set<string> | undefined,
        associatedValues:
            | Map<string, ContextualValueCalculationCallback<TSchema>>
            | undefined,
        ambientValues:
            | Map<string, ContextualValueCalculationCallback<TSchema>>
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
        | Map<string, ContextualValueCalculationCallback<TSchema>>
        | undefined;
    ambientValues?:
        | Map<string, ContextualValueCalculationCallback<TSchema>>
        | undefined;

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
        return this.attr('property:category', category);
    }

    public displayName(displayName: string | undefined | null): this {
        return this.attr('displayName', displayName);
    }

    public visible(visibility: boolean): this {
        return this.attr('property:visible', visibility);
    }

    public withAssociatedValue(
        name: string,
        callback: ContextualValueCalculationCallback<AnyTypeConstraint>,
    ): this;
    public withAssociatedValue(name: string, value: unknown): this;
    public withAssociatedValue(name: string, callbackOrValue: unknown): this {
        (this.associatedValues ?? (this.associatedValues = new Map())).set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<AnyTypeConstraint>)
                : () => callbackOrValue,
        );
        return this;
    }

    public withAmbientValue(
        name: string,
        callback: ContextualValueCalculationCallback<AnyTypeConstraint>,
    ): this;
    public withAmbientValue(name: string, value: unknown): this;
    public withAmbientValue(name: string, callbackOrValue: unknown): this {
        (this.ambientValues ?? (this.ambientValues = new Map())).set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<AnyTypeConstraint>)
                : () => callbackOrValue,
        );
        return this;
    }

    public static empty<TSchema extends AnyTypeConstraint>(): AnnotationsBuilderImpl<TSchema> { 
        return new AnnotationsBuilderImpl(undefined, undefined, undefined, undefined);
    }
}
