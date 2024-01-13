import { descend } from '@captainpants/sweeter-utilities';
import {
    type ContextualValueCalculationCallback,
    type ContextualValueCalculationContext,
} from '../ContextualValues.js';
import { deepFreeze } from '../internal/deepFreeze.js';
import { stringForError } from '../internal/stringForError.js';
import { type ReadonlySignalLike } from '../ReadonlySignalLike.js';
import { Maybe } from '../utility/Maybe.js';
import { flattenValidatorResultsToStrings } from '../validation/flattenValidatorResultsToStrings.js';
import {
    type ValidationOptions,
    type ValidationResult,
    type ValidationSingleResult,
    type Validator,
} from '../validation/types.js';

import { type AttributeValue } from './_types.js';
import { type Type } from './Type.js';

export abstract class BaseType<TValue> implements Type<TValue> {
    public displayName: string | null = null;
    public name: string | null = null;

    public readonly validators: Array<Validator<TValue>> = [];
    public readonly labels: string[] = [];
    public readonly attributes: Map<string, unknown> = new Map<
        string,
        unknown
    >();

    public get isConstant(): boolean {
        return false;
    }

    public readonly localValues: Map<
        string,
        ContextualValueCalculationCallback<TValue>
    > = new Map<string, ContextualValueCalculationCallback<TValue>>();

    public readonly ambientValues: Map<
        string,
        ContextualValueCalculationCallback<TValue>
    > = new Map<string, ContextualValueCalculationCallback<TValue>>();

    public defaultFactory: (() => TValue) | null = null;

    public getBestDisplayName(): string {
        return this.displayName ?? this.name ?? '<unknown>';
    }

    /**
     * Calls the callback on the current type, then freezes the type.
     * @param callback
     * @returns
     */
    public setup(callback: (self: this) => void): this {
        callback(this);
        this.freeze();
        return this;
    }

    public freeze(): this {
        deepFreeze(this);
        return this;
    }

    public withName(name: string): this {
        this.name = name;
        return this;
    }

    public withDisplayName(displayName: string): this {
        this.displayName = displayName;
        return this;
    }

    public withLabel(label: string): this {
        this.labels.push(label);
        return this;
    }

    public withLabels(...labels: string[]): this {
        this.labels.push(...labels);
        return this;
    }

    public withAttr(name: string, value: unknown): this;
    public withAttr<T>(value: AttributeValue<T>): this;
    public withAttr<T>(first: string | AttributeValue<T>, value?: T): this {
        if (typeof first === 'string') {
            this.attributes.set(first, value);
        } else {
            this.attributes.set(first.name, first.value);
        }
        return this;
    }

    public withValidator(validator: Validator<TValue>): this {
        this.validators.push(validator);
        return this;
    }

    public withLocalValue(
        name: string,
        callback: ContextualValueCalculationCallback<TValue>,
    ): this;
    public withLocalValue(name: string, value: unknown): this;
    public withLocalValue(
        name: string,
        callbackOrValue: ContextualValueCalculationCallback<TValue> | unknown,
    ): this {
        this.localValues.set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<TValue>)
                : () => callbackOrValue,
        );
        return this;
    }

    public withAmbientValue(
        name: string,
        callback: ContextualValueCalculationCallback<TValue>,
    ): this;
    public withAmbientValue(name: string, value: unknown): this;
    public withAmbientValue(
        name: string,
        callbackOrValue: ContextualValueCalculationCallback<TValue> | unknown,
    ): this {
        this.ambientValues.set(
            name,
            typeof callbackOrValue === 'function'
                ? (callbackOrValue as ContextualValueCalculationCallback<TValue>)
                : () => callbackOrValue,
        );
        return this;
    }

    public matches(value: unknown): value is TValue {
        return this.doMatches(value, true, 25);
    }

    public abstract doMatches(
        value: unknown,
        deep: boolean,
        depth: number,
    ): value is TValue;

    private applyDefaultValidationOptions(
        options?: ValidationOptions,
    ): ValidationOptions {
        return Object.assign({ deep: true }, options);
    }

    public async validate(
        value: unknown,
        options?: ValidationOptions,
        depth: number = descend.defaultDepth,
    ): ValidationResult<TValue> {
        const withDefaults = this.applyDefaultValidationOptions(options);

        // Note that this is a type assertion
        // Passing deep: false as the assumption is that doMatches
        // will be called at each level of validation, which would multiply the cost of
        // doing validation.
        if (!this.doMatches(value, false, depth)) {
            return Maybe.error([{ message: 'Non-matching structure' }]);
        }

        const errors: ValidationSingleResult[] = [];

        // Validate children first, as we need to
        // make sure structure is correct before validating the parent
        if (withDefaults.deep) {
            const validationResultsForDescendents = await this.validateChildren(
                value,
                withDefaults,
                descend(depth),
            );
            if (validationResultsForDescendents !== undefined) {
                errors.push(...validationResultsForDescendents);
            }
        }

        for (const validator of this.validators) {
            const result = await validator(value);

            if (result !== null) {
                const flattened =
                    await flattenValidatorResultsToStrings(result);
                errors.push(...flattened.map((item) => ({ message: item })));
            }
        }

        if (errors.length > 0) {
            return Maybe.error(errors);
        }
        return Maybe.success(value as unknown as TValue);
    }

    public async validateAndThrow(
        value: unknown,
        options?: ValidationOptions,
        depth: number = descend.defaultDepth,
    ): Promise<TValue> {
        const res = await this.validate(value, options, depth);

        if (!res.success) {
            throw new TypeError(
                `Value ${stringForError(
                    value,
                )} did not pass validation:\n\n ${res.error
                    .map(
                        (item) =>
                            `- ${item.idPath ? `(${item.idPath}) ` : ''} ${
                                item.message
                            }`,
                    )
                    .join('\n ')}`,
            );
        }

        return res.result;
    }

    protected async validateChildren(
        value: TValue,
        options: ValidationOptions,
        depth: number,
    ): Promise<ValidationSingleResult[] | undefined> {
        return undefined;
    }

    public withDefault(factory?: (() => TValue) | null | undefined): this {
        this.defaultFactory = factory ?? null;
        return this;
    }

    public createDefault(depth: number = descend.defaultDepth): TValue {
        if (this.defaultFactory) {
            return this.defaultFactory();
        }

        return this.doCreateDefault(depth);
    }

    public abstract doCreateDefault(depth: number): TValue;

    public abstract toTypeString(depth?: number): string;

    public hasLabel(label: string): boolean {
        return this.labels.includes(label);
    }

    public getAttribute(name: string): unknown {
        return this.attributes.get(name);
    }

    public getAmbientValue(
        name: string,
        value: ReadonlySignalLike<TValue>,
        context: ContextualValueCalculationContext,
    ): unknown {
        const found = this.ambientValues.get(name);

        if (!found) {
            return undefined;
        }

        return found(value, context);
    }

    public getAmbientValueForUnknown(
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ): unknown {
        if (!this.doMatches(value, true, descend.defaultDepth)) {
            throw new Error('Incorrect type value provided.');
        }

        return this.getAmbientValue(
            name,
            value as ReadonlySignalLike<TValue>,
            context,
        );
    }

    public getLocalValue(
        name: string,
        value: ReadonlySignalLike<TValue>,
        context: ContextualValueCalculationContext,
    ): unknown {
        const found = this.localValues.get(name);

        if (!found) {
            return undefined;
        }

        return found(value, context);
    }

    public getLocalValueForUnknown(
        name: string,
        value: ReadonlySignalLike<unknown>,
        context: ContextualValueCalculationContext,
    ): unknown {
        if (!this.doMatches(value, true, descend.defaultDepth)) {
            throw new Error('Incorrect type value provided.');
        }

        return this.getLocalValue(
            name,
            value as ReadonlySignalLike<TValue>,
            context,
        );
    }
}
