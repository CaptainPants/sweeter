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
    $derive,
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
    const idPath = $derive(() => {
        return idPaths.key($val(ownerIdPath), String(property));
    });

    const replace = async (value: UnknownModel) => {
        await $peek(updateValue)($peek(property), value);
    };

    const { localize } = init.hook(LocalizerHook);

    const valueModel = $derive(() => $val(value));
    const displayName = $derive(
        () =>
            $val(value).type.annotations()?.displayName() ??
            String($val(property)),
    );

    return $derive(() => {
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
