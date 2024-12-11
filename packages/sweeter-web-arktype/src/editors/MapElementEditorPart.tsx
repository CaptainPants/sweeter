import {
    $calc,
    $peek,
    $val,
    type ComponentInit,
    LocalizerHook,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { UnknownPropertyModel, type UnknownModel } from '@captainpants/arktype-modeling';
import { EditorHost } from '../components/EditorHost.js';
import { idPaths } from '@captainpants/sweeter-utilities';

export type MapElementEditorPartProps = PropertiesMightBeSignals<{
    id: string;

    property: string | symbol;
    value: UnknownModel;
    updateElement: (
        property: string | symbol,
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
        property,
        value,
        updateElement,
        indent,
        ownerIdPath,
    }: MapElementEditorPartProps,
    init: ComponentInit,
): JSX.Element {
    const replace = async (value: UnknownModel) => {
        await $peek(updateElement)($peek(property), value);
    };

    const { localize } = init.hook(LocalizerHook);

    const propertyNameAsString = $calc(() => String($val(property)));

    return (
        <EditorHost
            model={value}
            replace={replace}
            propertyDisplayName={$calc(() => localize($val(propertyNameAsString)))}
            indent={indent}
            idPath={$calc(() =>
                idPaths.key($val(ownerIdPath), $val(propertyNameAsString)),
            )}
        />
    );
}
