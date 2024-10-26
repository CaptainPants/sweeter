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

export type ElementEditorPartProps = PropertiesMightBeSignals<{
    index: number;
    elementModel: Model<unknown>;
    updateElement: (index: number, value: Model<unknown>) => Promise<void>;

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
    const replace = async (value: Model<unknown>) => {
        await $peek(updateElement)($peek(index), value);
    };

    const { localize } = init.hook(LocalizerHook);

    return (
        <EditorHost
            model={elementModel}
            replace={replace}
            propertyDisplayName={$calc(() =>
                localize('Element {0}', [$val(index) + 1]),
            )}
            indent={indent}
            idPath={$calc(() => idPaths.index($val(ownerIdPath), $val(index)))}
        />
    );
}
