import {
    $calc,
    $peek,
    $val,
    type ComponentInit,
    LocalizerHook,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { type UnknownModel } from '@captainpants/arktype-modeling';
import { EditorHost } from '../components/EditorHost.js';
import { idPaths } from '@captainpants/sweeter-utilities';

export type MapElementEditorPartProps = PropertiesMightBeSignals<{
    id: string;

    propertyName: string | symbol;
    elementModel: UnknownModel;
    updateElement: (
        name: string | symbol,
        value: UnknownModel,
    ) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}>;

export function MapElementEditorPart(
    props: MapElementEditorPartProps,
    init: ComponentInit,
): JSX.Element;
export function MapElementEditorPart(
    {
        propertyName: elementKey,
        elementModel,
        updateElement,
        indent,
        ownerIdPath,
    }: MapElementEditorPartProps,
    init: ComponentInit,
): JSX.Element {
    const replace = async (value: UnknownModel) => {
        await $peek(updateElement)($peek(elementKey), value);
    };

    const { localize } = init.hook(LocalizerHook);

    const stringKey = $calc(() => String($val(elementKey)));

    return (
        <EditorHost
            model={elementModel}
            replace={replace}
            propertyDisplayName={$calc(() => localize($val(stringKey)))}
            indent={indent}
            idPath={$calc(() =>
                idPaths.key($val(ownerIdPath), $val(stringKey)),
            )}
        />
    );
}
