import {
    $calc,
    $peek,
    $val,
    type ComponentInit,
    LocalizerHook,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { type Model } from '@captainpants/zod-matcher';
import { EditorHost } from '../components/EditorHost.js';
import { idPaths } from '../idPaths.js';

export type MapElementEditorPartProps = PropertiesMightBeSignals<{
    id: string;

    propertyName: string;
    elementModel: Model<unknown>;
    updateElement: (name: string, value: Model<unknown>) => Promise<void>;

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
    const replace = async (value: Model<unknown>) => {
        await $peek(updateElement)($peek(elementKey), value);
    };

    const { localize } = init.hook(LocalizerHook);

    return (
        <EditorHost
            model={elementModel}
            replace={replace}
            propertyDisplayName={$calc(() => localize($val(elementKey)))}
            indent={indent}
            idPath={$calc(() =>
                idPaths.key($val(ownerIdPath), $val(elementKey)),
            )}
        />
    );
}
