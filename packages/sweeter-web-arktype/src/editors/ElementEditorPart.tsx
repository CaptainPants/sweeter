import {
    $derive,
    $peek,
    $val,
    type ComponentInit,
    LocalizerHook,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { type UnknownModel } from '@captainpants/sweeter-arktype-modeling';
import { EditorHost } from '../components/EditorHost.js';
import { idPaths } from '@captainpants/sweeter-utilities';

export type ElementEditorPartProps = PropertiesMightBeSignals<{
    index: number;
    elementModel: UnknownModel;
    updateElement: (index: number, value: UnknownModel) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}>;

export function ElementEditorPart(
    props: ElementEditorPartProps,
    init: ComponentInit,
): JSX.Element;
export function ElementEditorPart(
    {
        index,
        elementModel,
        updateElement,
        indent,
        ownerIdPath,
    }: ElementEditorPartProps,
    init: ComponentInit,
): JSX.Element {
    const replace = async (value: UnknownModel) => {
        await $peek(updateElement)($peek(index), value);
    };

    const { localize } = init.hook(LocalizerHook);

    return (
        <EditorHost
            model={elementModel}
            replace={replace}
            propertyDisplayName={$derive(() =>
                localize('Element {0}', [$val(index) + 1]),
            )}
            indent={indent}
            idPath={$derive(() =>
                idPaths.index($val(ownerIdPath), $val(index)),
            )}
        />
    );
}
