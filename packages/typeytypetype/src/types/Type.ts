import { type ContextualValueCalculationContext } from '../ContextualValues.js';
import { type ReadonlySignalLike } from '../ReadonlySignalLike.js';
import {
    type ValidationOptions,
    type ValidationResult,
} from '../validation/types.js';

export interface Type<TValue> {
    readonly name: string | null;
    readonly displayName: string | null;
    readonly isConstant: boolean;

    getBestDisplayName: () => string;

    matches: (value: unknown) => value is TValue;

    doMatches: (
        value: unknown,
        deep: boolean,
        depth: number,
    ) => value is TValue;

    validate: (
        value: unknown,
        options?: ValidationOptions,
        depth?: number,
    ) => ValidationResult<TValue>;

    validateAndThrow: (
        value: unknown,
        options?: ValidationOptions,
    ) => Promise<TValue>;

    createDefault: (depth?: number) => TValue;

    doCreateDefault: (depth: number) => TValue;

    toTypeString: (depth?: number) => string;

    hasLabel: (label: string) => boolean;

    getAttribute: (name: string) => unknown;

    getAmbientValueForUnknown: (
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ) => unknown;

    getLocalValueForUnknown: (
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ) => unknown;
}
