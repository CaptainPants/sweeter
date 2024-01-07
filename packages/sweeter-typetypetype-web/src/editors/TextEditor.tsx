import {
    asString,
    cast,
    ModelFactory,
    type StringModel,
} from '@captainpants/typeytypetype';
import { DraftHook } from '../hooks/DraftHook.js';
import { $calc, type ComponentInit } from '@captainpants/sweeter-core';
import { type EditorProps } from '../types.js';
import { TextArea } from '@captainpants/sweeter-gummybear';
import { ValidationDisplay } from './ValidationDisplay.js';

export function TextEditor(
    { model, replace, propertyDisplayName, idPath }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const typedModel = $calc(() => {
        return cast(model.value, asString);
    });

    const { draft, validationErrors } = init.hook(
        DraftHook<StringModel, string>,
        {
            model: typedModel,
            onValid: async (validated) => {
                await replace(validated);
            },
            convertIn: (model) => model.value,
            convertOut: (draft) => ({
                success: true,
                result: ModelFactory.createUnvalidatedReplacement(
                    draft,
                    typedModel.peek(),
                ),
            }),
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
            <TextArea
                id={idPath}
                fillWidth
                value={draft}
                invalid={invalid}
                placeholder={propertyDisplayName}
            />
            <ValidationDisplay errors={validationErrors} />
        </>
    );
}
