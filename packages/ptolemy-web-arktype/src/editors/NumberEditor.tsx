import {
    asNumber,
    cast,
    ModelFactory,
    type NumberModel,
    validate,
} from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $lastGood,
    $peek,
    $val,
    type Component,
} from '@serpentis/ptolemy-core';
import { Input } from '@serpentis/ptolemy-web-stardust';

import { DraftHook } from '../hooks/DraftHook.js';
import { type EditorProps } from '../types.js';

import { ValidationDisplay } from './ValidationDisplay.js';

export const NumberEditor: Component<EditorProps> = (
    { model, replace, propertyDisplayName, idPath },
    init,
) => {
    const typedModel = $lastGood(() => {
        return cast($val(model), asNumber);
    });

    const { draft, validationErrors } = init.hook(
        DraftHook<NumberModel, string>,
        {
            model: typedModel,
            onValid: async (validated) => {
                await $peek(replace)(validated);
            },
            convertIn: (model) => String(model.value),
            convertOut: (draft) => {
                const parsed = Number(draft);
                if (isNaN(parsed)) {
                    return {
                        success: false,
                        error: [`Failed to parse ${draft} as a number.`],
                    };
                }

                const asModel = ModelFactory.createReplacement(
                    parsed,
                    typedModel.peek(),
                );
                return { success: true, result: asModel };
            },
            validate: async (converted) => {
                const res = await validate(
                    typedModel.peek().type,
                    converted.value,
                );
                return res.success ? null : res.error;
            },
        },
    );

    const invalid = $derived(
        () =>
            validationErrors.value !== null &&
            validationErrors.value.length > 0,
    );

    return (
        <>
            <Input
                type="number"
                id={idPath}
                fillWidth
                bind:value={draft}
                invalid={invalid}
                placeholder={propertyDisplayName}
            />
            <ValidationDisplay errors={validationErrors} />
        </>
    );
};
