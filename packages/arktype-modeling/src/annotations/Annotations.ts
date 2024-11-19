import { type, Type } from 'arktype';
import {
    AnyTypeConstraint,
    arkTypeUtilityTypes,
    type ContextualValueCalculationCallback,
    type ContextualValueCalculationContext,
} from '../index.js';

export interface Annotations<
    TArkType extends AnyTypeConstraint,
> {
    attr(name: string, value: unknown): this;

    getAttr(name: string, fallback: unknown): unknown;
    getAttrValidated<TValueArkType extends AnyTypeConstraint>(
        name: string,
        valueSchema: TValueArkType,
        fallback: Type['infer'],
    ): TValueArkType['infer'];

    label(name: string, val?: boolean): this;
    hasLabel(name: string): boolean;

    category(category: string | null): this;
    category(): string | null;

    displayName(displayName: string | null): this;
    displayName(): string | null;
    getBestDisplayName(): string;

    visible(visibility: boolean): this;
    visible(): boolean;

    withAssociatedValue(
        name: string,
        callback: ContextualValueCalculationCallback<Type>,
    ): this;
    withAssociatedValue(name: string, value: unknown): this;

    withAmbientValue(
        name: string,
        callback: ContextualValueCalculationCallback<Type>,
    ): this;
    withAmbientValue(name: string, value: unknown): this;

    getAssociatedValue(
        name: string,
        value: unknown,
        context: ContextualValueCalculationContext,
    ): unknown;

    getAmbientValue(
        name: string,
        value: unknown,
        context: ContextualValueCalculationContext,
    ): unknown;

    end(): TArkType;
}

export type AnnotationSetter<
    TArkType extends AnyTypeConstraint,
> = (annotations: Annotations<TArkType>) => void;
