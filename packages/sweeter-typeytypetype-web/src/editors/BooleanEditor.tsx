import {
    asBoolean,
    cast,
    ModelFactory,
    type UnionModel,
    asUnknown,
} from '@captainpants/typeytypetype';
import { DraftHook } from '../hooks/DraftHook.js';
import {
    $calc,
    $lastValid,
    $peek,
    $val,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { type EditorProps } from '../types.js';
import { CheckBox } from '@captainpants/sweeter-gummybear';
import { ValidationDisplay } from './ValidationDisplay.js';

export function BooleanEditor(
    { model, replace, propertyDisplayName, idPath }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $lastValid(() => {
        return cast($val(model), asBoolean);
    });

    const { draft, validationErrors } = init.hook(
        DraftHook<UnionModel<boolean>, boolean>,
        {
            model: typedModel,
            onValid: async (validated) => {
                await $peek(replace)(cast(validated, asUnknown));
            },
            convertIn: (model) => model.value,
            convertOut: (draft) => {
                const asModel = ModelFactory.createUnvalidatedReplacement(
                    draft,
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
            <CheckBox
                id={idPath}
                fillWidth
                bind:checked={draft}
                invalid={invalid}
                placeholder={propertyDisplayName}
            />
            <ValidationDisplay errors={validationErrors} />
        </>
    );
}
