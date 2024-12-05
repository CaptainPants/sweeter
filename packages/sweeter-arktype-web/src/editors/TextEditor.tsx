import {
    asString,
    cast,
    ModelFactory,
    validate,
    type StringModel,
} from '@captainpants/arktype-modeling';
import { DraftHook } from '../hooks/DraftHook.js';
import {
    $calc,
    $lastGood,
    $peek,
    $val,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { type EditorProps } from '../types.js';
import { TextArea } from '@captainpants/sweeter-gummybear';
import { ValidationDisplay } from './ValidationDisplay.js';

export function TextEditor(
    { model, replace, propertyDisplayName, idPath }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $lastGood(() => {
        return cast($val(model), asString);
    });

    const { draft, validationErrors } = init.hook(
        DraftHook<StringModel, string>,
        {
            model: typedModel,
            onValid: async (validated) => {
                await $peek(replace)(validated);
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

    const invalid = $calc(
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
}
