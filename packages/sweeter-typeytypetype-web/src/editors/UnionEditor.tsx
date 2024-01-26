import { Select } from '@captainpants/sweeter-gummybear';
import { type EditorProps } from '../types.js';
import {
    type Model,
    ModelFactory,
    type Type,
    asUnion,
    cast,
} from '@captainpants/typeytypetype';
import { $calc, $if, $peek, $val } from '@captainpants/sweeter-core';
import { EditorHost } from '../index.js';
import { idPaths } from '../idPaths.js';

export function UnionEditor(props: Readonly<EditorProps>): JSX.Element;
export function UnionEditor({
    model,
    replace,
    idPath,
    indent,
}: Readonly<EditorProps>): JSX.Element {
    const typedModel = $calc(() => cast($val(model), asUnion));

    const type = $calc(() => typedModel.value.type);

    const alternatives = $calc(() =>
        type.value.types.map((alternative) => {
            return {
                label: alternative.displayName ?? alternative.name ?? 'unknown',
                type: alternative,
            };
        }),
    );

    const selectOptions = $calc(() => {
        return alternatives.value.map((x, index) => ({
            text: x.label,
            value: String(index),
        }));
    });

    const changeType = async (type: Type<unknown>): Promise<void> => {
        const defaultValue = type.createDefault();
        const defaultModel = await ModelFactory.createModel({
            value: defaultValue,
            type: typedModel.peek().type,
        });
        await $peek(replace)(defaultModel);
    };

    const resolved = $calc(() => typedModel.value.getDirectltResolved());

    const replaceResolved = async (
        newResolvedModel: Model<unknown>,
    ): Promise<void> => {
        const defaultModel = await typedModel
            .peek()
            .replace(newResolvedModel, false);
        await $peek(replace)(defaultModel);
    };

    const typeIndex = $calc(() => type.value.getTypeIndexForValue(model.value));

    return (
        <div>
            <div>
                <Select
                    id={idPath}
                    value={$calc(() => typeIndex.value.toString())}
                    onInput={(evt) => {
                        const index = Number(evt.target?.value);
                        const type = alternatives.peek()[index]?.type;
                        if (!type) return;
                        void changeType(type);
                    }}
                    options={selectOptions}
                />
            </div>
            {$if(
                $calc(() => !resolved.value.type.isConstant),
                () => (
                    <EditorHost
                        model={resolved}
                        replace={replaceResolved}
                        indent={$calc(() => $val(indent) + 1)}
                        idPath={$calc(() =>
                            idPaths.union($val(idPath), typeIndex.value),
                        )}
                    />
                ),
            )}
        </div>
    );
}
