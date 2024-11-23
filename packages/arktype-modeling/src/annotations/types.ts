import type { Type } from 'arktype';
import {
    type AnyTypeConstraint,
    type ContextualValueCalculationCallback,
    type ContextualValueCalculationContext,
} from '../index.js';

export interface AnnotationsBuilder {
    attr(name: string, value: unknown): this;
    label(name: string, val?: boolean): this;
    category(category: string | null): this;
    displayName(displayName: string | null): this;
    visible(visibility: boolean): this;

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
}

export interface Annotations {
    attr(name: string, fallback: unknown): unknown;
    getAttrValidated<TValueArkType extends AnyTypeConstraint>(
        name: string,
        valueSchema: TValueArkType,
        fallback: Type['infer'],
    ): TValueArkType['infer'];

    hasLabel(name: string): boolean;

    category(): string | null;

    displayName(): string | null;
    getBestDisplayName(): string;

    visible(): boolean;

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
}

export type AnnotationSetter = (annotations: AnnotationsBuilder) => void;
