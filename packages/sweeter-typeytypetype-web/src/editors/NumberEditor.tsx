import {
    asNumber,
    cast,
    ModelFactory,
    type NumberModel,
} from '@captainpants/typeytypetype';
import { DraftHook } from '../hooks/DraftHook.js';
import {
    $calc,
    $lastGood,
    $peek,
    $val,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { type EditorProps } from '../types.js';
import { Input } from '@captainpants/sweeter-gummybear';
import { ValidationDisplay } from './ValidationDisplay.js';

export function NumberEditor(
    { model, replace, propertyDisplayName, idPath }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
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
                const asModel = ModelFactory.createUnvalidatedReplacement(
                    parsed,
                    typedModel.peek(),
                );
                return { success: true, result: asModel };
            },
            validate: async (converted) => {
                const res = await typedModel
                    .peek()
                    .type.validate(converted.value);
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
}
