import {
    asBoolean,
    type BooleanModel,
    cast,
    ModelFactory,
    validate,
} from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $lastGood,
    $peek,
    $val,
    type Component,
} from '@serpentis/ptolemy-core';
import { CheckBox } from '@serpentis/ptolemy-web-stardust';

import { DraftHook } from '../hooks/DraftHook.js';
import { type EditorProps } from '../types.js';

import { ValidationDisplay } from './ValidationDisplay.js';

export const BooleanEditor: Component<EditorProps> = (
    { model, replace, idPath },
    init,
) => {
    const typedModel = $lastGood(() => {
        return cast($val(model), asBoolean);
    });

    const { draft, validationErrors } = init.hook(
        DraftHook<BooleanModel, boolean>,
        {
            model: typedModel,
            onValid: async (validated) => {
                await $peek(replace)(validated);
            },
            convertIn: (model) => model.value,
            convertOut: (draft) => {
                const asModel = ModelFactory.createReplacement(
                    draft,
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
            <CheckBox
                id={idPath}
                fillWidth
                bind:checked={draft}
                invalid={invalid}
            />
            <ValidationDisplay errors={validationErrors} />
        </>
    );
}
