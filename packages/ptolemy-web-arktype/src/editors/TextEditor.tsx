import {
    asString,
    cast,
    ModelFactory,
    type StringModel,
    validate,
} from '@serpentis/ptolemy-arktype-modeling';
import { $derived, $lastGood, Component } from '@serpentis/ptolemy-core';
import { TextArea } from '@serpentis/ptolemy-web-stardust';

import { DraftHook } from '../hooks/DraftHook.js';
import { type EditorProps } from '../types.js';

import { ValidationDisplay } from './ValidationDisplay.js';

export const TextEditor: Component<EditorProps> = (
    { model, replace, propertyDisplayName, idPath },
    init,
) => {
    const typedModel = $lastGood(() => {
        return cast(model.value, asString);
    });

    const { draft, validationErrors } = init.hook(
        DraftHook<StringModel, string>,
        {
            model: typedModel,
            onValid: async (validated) => {
                await replace.peek()(validated);
            },
            convertIn: (model) => model.value,
            convertOut: (draft) => ({
                success: true,
                result: ModelFactory.createReplacement(
                    draft,
                    typedModel.peek(),
                ),
            }),
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
            <TextArea
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
