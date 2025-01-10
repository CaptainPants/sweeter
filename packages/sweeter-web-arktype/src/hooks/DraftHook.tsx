import { type ValidationSingleResult } from '@captainpants/sweeter-arktype-modeling';
import {
    $derived,
    $mutable,
    $readonly,
    AsyncRunnerHook,
    type ComponentInit,
    type Signal,
} from '@captainpants/sweeter-core';
import { type Maybe } from '@captainpants/sweeter-utilities';

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

export function DraftHook<TModel, TDraft>(
    init: ComponentInit,
    {
        convertIn,
        convertOut,
        model,
        validate,
        onValid,
    }: DraftHookOptions<TModel, TDraft>,
) {
    const modelConverted = $derived(() => {
        return convertIn(model.value);
    });
    const draft = $mutable<TDraft>(modelConverted.peek());

    const validationErrors = $mutable<ValidationSingleResult[] | null>(null);
    const validationErrorsReadonly = $readonly(validationErrors);

    init.onSignalChange([modelConverted], ([latestFromModel]) => {
        draft.value = latestFromModel;
    });

    const asyncRunner = init.hook(AsyncRunnerHook);

    init.onSignalChange([draft], ([draft]) => {
        if (draft === modelConverted.peek()) {
            return; // If the draft matches our current view of the incoming model, then don't try to update back up the tree
        }

        // Should this be debounced?
        asyncRunner.run(async (abort) => {
            const convertResult = convertOut(draft);

            // Failed conversion out, treated as a validation failure
            if (!convertResult.success) {
                validationErrors.value = convertResult.error.map((x) => ({
                    message: x,
                }));
                return;
            }

            const converted = convertResult.result;

            const validationFailures = await validate(converted, abort);

            validationErrors.value = validationFailures
                ? null
                : validationFailures;

            if (validationFailures == null) {
                onValid?.(converted);
            }
        });
    });

    return {
        draft,
        validationErrors: validationErrorsReadonly,
        isValidating: asyncRunner.running,
    };
}
