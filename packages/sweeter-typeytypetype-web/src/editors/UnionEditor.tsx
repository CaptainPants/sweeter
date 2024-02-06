import { Select } from '@captainpants/sweeter-gummybear';
import { type EditorProps } from '../types.js';
import {
    type Model,
    ModelFactory,
    type Type,
    asUnion,
    cast,
} from '@captainpants/typeytypetype';
import {
    $calc,
    $if,
    $mutableFromCallbacks,
    $peek,
    $val,
} from '@captainpants/sweeter-core';
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
        // Only depends on 'type' signal
        type.value.types.map((alternative) => {
            return {
                label: alternative.displayName ?? alternative.name ?? 'unknown',
                type: alternative,
            };
        }),
    );

    const selectOptions = $calc(() => {
        // Only depends on 'alternatives' signal
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

    const resolved = $calc(() => typedModel.value.getDirectlyResolved());

    const replaceResolved = async (
        newResolvedModel: Model<unknown>,
    ): Promise<void> => {
        const defaultModel = await typedModel
            .peek()
            .replace(newResolvedModel, false);
        await $peek(replace)(defaultModel);
    };

    const typeIndex = $calc(() =>
        type.value.getTypeIndexForValue(typedModel.value.value),
    );

    const typeValue = $mutableFromCallbacks(
        () => typeIndex.value.toString(),
        (value) => {
            const index = Number(value);
            const type = alternatives.peek()[index]?.type;
            if (!type) return;
            void changeType(type);
        },
    );

    return (
        <div>
            <div>
                <Select
                    id={idPath}
                    bind:value={typeValue}
                    options={selectOptions}
                />
            </div>
            {$if(
                $calc(() => !resolved.value.type.isConstant),
                () => (
                    <EditorHost
                        model={resolved}
                        replace={replaceResolved}
                        indent={indent}
                        idPath={$calc(() =>
                            idPaths.union($val(idPath), typeIndex.value),
                        )}
                    />
                ),
            )}
        </div>
    );
}
