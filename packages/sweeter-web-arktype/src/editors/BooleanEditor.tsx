import {
    asBoolean,
    cast,
    ModelFactory,
    type BooleanModel,
    validate,
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
import { CheckBox } from '@captainpants/sweeter-web-gummybear';
import { ValidationDisplay } from './ValidationDisplay.js';

export function BooleanEditor(
    { model, replace, propertyDisplayName, idPath }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
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

    const invalid = $calc(
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
