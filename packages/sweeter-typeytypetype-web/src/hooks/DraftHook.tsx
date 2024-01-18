import {
    type ReadWriteSignal,
    type ComponentInit,
    type Signal,
    $mutable,
    $readonly,
    AsyncRunnerHook,
} from '@captainpants/sweeter-core';
import { type Maybe } from '@captainpants/sweeter-utilities';
import { type ValidationSingleResult } from '@captainpants/typeytypetype';

export interface DraftHookOptions<TModel, TDraft> {
    model: Signal<TModel>;
    convertIn: (value: TModel) => TDraft;
    convertOut: (value: TDraft) => Maybe<TModel, string[]>;
    validate: (
        value: TModel,
        signal: AbortSignal,
    ) => Promise<ValidationSingleResult[] | null>;
    onValid?: (value: TModel) => Promise<void>;
}

export class DraftHook<TModel, TDraft> {
    constructor(
        init: ComponentInit,
        options: DraftHookOptions<TModel, TDraft>,
    ) {
        this.model = options.model;
        this.draft = $mutable<TDraft>(options.convertIn(this.model.peek()));

        this.#validationErrors = $mutable<ValidationSingleResult[] | null>(
            null,
        );
        this.validationErrors = $readonly(this.#validationErrors);

        this.#convertIn = options.convertIn;
        this.#convertOut = options.convertOut;
        this.#validate = options.validate;

        init.subscribeToChangesImmediate([this.model], () => {
            // TODO: There is a circular reference here I think.. actual -> draft -> actual
            this.#reset();
        });

        const asyncRunner = init.hook(AsyncRunnerHook);
        this.isValidating = $readonly(asyncRunner.running);

        init.subscribeToChanges([this.draft], ([draft]) => {
            // Should this be debounced?
            asyncRunner.run(async (signal) => {
                this.#update(signal, draft);
            });
        });

        this.#onValid = options.onValid;
    }

    readonly model: Signal<TModel>;
    readonly draft: ReadWriteSignal<TDraft>;
    readonly validationErrors: Signal<ValidationSingleResult[] | null>;
    readonly isValidating: Signal<boolean>;

    readonly #validationErrors: ReadWriteSignal<
        ValidationSingleResult[] | null
    >;

    #convertIn: (model: TModel) => TDraft;
    #convertOut: (draft: TDraft) => Maybe<TModel, string[]>;
    #validate: (
        value: TModel,
        signal: AbortSignal,
    ) => Promise<ValidationSingleResult[] | null>;
    #onValid?: ((value: TModel) => void) | undefined;

    #reset(): void {
        this.draft.update(this.#convertIn(this.model.value));
    }

    async #update(abortSignal: AbortSignal, draft: TDraft) {
        const convertResult = this.#convertOut(draft);

        // Failed conversion out, treated as a validation failure
        if (!convertResult.success) {
            this.#validationErrors.update(
                convertResult.error.map((x) => ({ message: x })),
            );
            return;
        }

        const converted = convertResult.result;

        const validationFailures = await this.#validate(converted, abortSignal);

        this.#validationErrors.update(
            validationFailures ? null : validationFailures,
        );

        if (validationFailures == null) {
            this.#onValid?.(converted);
        }
    }
}
