import {
    type ReadWriteSignal,
    type ComponentInit,
    type Signal,
    $mutable,
    $readonly,
    AsyncRunnerHook,
} from '@captainpants/sweeter-core';
import { type Maybe } from '@captainpants/sweeter-utilities';

export interface DraftHookOptions<TModel, TDraft> {
    convertIn: (value: TModel) => TDraft;
    convertOut: (value: TDraft) => Maybe<TModel, string[]>;
    validate: (abort: AbortSignal, value: TModel) => Promise<string[] | null>;
    onValid?: (value: TModel) => void;
}

export class DraftHook<TModel, TDraft> {
    constructor(
        init: ComponentInit,
        actual: ReadWriteSignal<TModel>,
        options: DraftHookOptions<TModel, TDraft>,
    ) {
        this.actual = actual;
        this.draft = $mutable<TDraft>(options.convertIn(this.actual.value));

        this.#validationErrors = $mutable<string[] | null>(null);
        this.validationErrors = $readonly(this.#validationErrors);

        this.#convertIn = options.convertIn;
        this.#convertOut = options.convertOut;
        this.#validate = options.validate;

        init.subscribeToChanges([this.actual], () => {
            // TODO: There is a circular reference here I think.. actual -> draft -> actual
            this.#reset();
        });

        const asyncRunner = init(AsyncRunnerHook);
        this.isValidating = $readonly(asyncRunner.running);

        init.subscribeToChanges([this.draft], ([draft]) => {
            // Should this be debounced?
            asyncRunner.run(async (signal) => {
                this.#update(signal, draft);
            });
        });

        this.#onValid = options.onValid;
    }

    readonly actual: ReadWriteSignal<TModel>;
    readonly draft: ReadWriteSignal<TDraft>;
    readonly validationErrors: Signal<string[] | null>;
    readonly isValidating: Signal<boolean>;

    readonly #validationErrors: ReadWriteSignal<string[] | null>;

    #convertIn: (model: TModel) => TDraft;
    #convertOut: (draft: TDraft) => Maybe<TModel, string[]>;
    #validate: (abort: AbortSignal, value: TModel) => Promise<string[] | null>;
    #onValid?: ((value: TModel) => void) | undefined;

    #reset(): void {
        this.draft.update(this.#convertIn(this.actual.value));
    }

    async #update(abortSignal: AbortSignal, draft: TDraft) {
        const convertResult = this.#convertOut(draft);

        // Failed conversion out, treated as a validation failure
        if (!convertResult.success) {
            this.#validationErrors.update(convertResult.error);
            return;
        }

        const converted = convertResult.result;

        const validationFailures = await this.#validate(abortSignal, converted);

        this.#validationErrors.update(
            validationFailures ? null : validationFailures,
        );

        if (validationFailures == null) {
            this.actual.update(converted);
            this.#onValid?.(converted);
        }
    }
}
