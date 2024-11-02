
import { Type } from 'arktype';
import {
    arkTypeUtilityTypes,
    type ContextualValueCalculationCallback,
    type ContextualValueCalculationContext,
} from '../index.js';

export interface Annotations<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint> {
    attr(name: string, value: unknown): this;

    getAttr(name: string, fallback: unknown): unknown;
    getAttrValidated<TValueArkType extends Type>(
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

    withLocalValue(
        name: string,
        callback: ContextualValueCalculationCallback<Type>,
    ): this;
    withLocalValue(name: string, value: unknown): this;

    withAmbientValue(
        name: string,
        callback: ContextualValueCalculationCallback<Type>,
    ): this;
    withAmbientValue(name: string, value: unknown): this;

    getLocalValue(
        name: string,
        value: TArkType['infer'],
        context: ContextualValueCalculationContext,
    ): unknown;

    getLocalValueForUnknown(
        name: string,
        value: unknown,
        context: ContextualValueCalculationContext,
    ): unknown;

    getAmbientValue(
        name: string,
        value: TArkType['infer'],
        context: ContextualValueCalculationContext,
    ): unknown;

    getAmbientValueForUnknown(
        name: string,
        value: unknown,
        context: ContextualValueCalculationContext,
    ): unknown;

    end(): TArkType;
}

export type AnnotationSetter<TArkType extends arkTypeUtilityTypes.AnyTypeConstraint> = (annotations: Annotations<TArkType>) => void;