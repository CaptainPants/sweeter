import {
    type UnknownModel,
} from '@captainpants/sweeter-arktype-modeling';
import {
    $derived,
    $peek,
    $val,
    type ComponentInit,
    LocalizerHook,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { idPaths } from '@captainpants/sweeter-utilities';

import { EditorHost } from '../components/EditorHost.js';

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
        return idPaths.key($val(ownerIdPath), String($val(property)));
    });

    const replace = async (value: UnknownModel) => {
        const name = $peek(property);
        await $peek(updateValue)(name, value);
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
