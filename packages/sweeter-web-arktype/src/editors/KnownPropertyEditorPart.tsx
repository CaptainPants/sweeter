import {
    type UnknownPropertyModel,
    type ContextualValueCalculationContext,
    type UnknownModel,
    UnknownObjectModel,
} from '@captainpants/sweeter-arktype-modeling';
import {
    LocalizerHook,
    type ComponentInit,
    type PropertiesMightBeSignals,
    $derived,
    $val,
    $peek,
    $subscribe,
} from '@captainpants/sweeter-core';

import { EditorHost } from '../components/EditorHost.js';
import { idPaths } from '@captainpants/sweeter-utilities';

export type KnownPropertyEditorPartProps = PropertiesMightBeSignals<{
    id: string;

    property: string | symbol;
    value: UnknownModel;
    updateValue: (
        property: string | symbol,
        value: UnknownModel,
    ) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}>;

export function KnownPropertyEditorPart(
    {
        id,
        property,
        value,
        updateValue,
        indent,
        ownerIdPath,
    }: KnownPropertyEditorPartProps,
    init: ComponentInit,
): JSX.Element {
    const idPath = $derived(() => {
        return idPaths.key($val(ownerIdPath), String(property));
    });

    const replace = async (value: UnknownModel) => {
        await $peek(updateValue)($peek(property), value);
    };

    const { localize } = init.hook(LocalizerHook);

    const valueModel = $derived(() => $val(value));
    const displayName = $derived(
        () =>
            $val(value).type.annotations()?.displayName() ??
            String($val(property)),
    );

    return $derived(() => {
        return (
            <EditorHost
                id={id}
                model={valueModel}
                replace={replace}
                propertyDisplayName={localize(displayName.value)}
                indent={indent}
                idPath={idPath}
            />
        );
    });
}
