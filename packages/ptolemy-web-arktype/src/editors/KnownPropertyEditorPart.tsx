import { type UnknownModel } from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $val,
    Component,
    LocalizerHook,
} from '@serpentis/ptolemy-core';
import { idPaths } from '@serpentis/ptolemy-utilities';

import { EditorHost } from '../components/EditorHost.js';

export interface KnownPropertyEditorPartProps {
    id: string;

    property: string | symbol;
    value: UnknownModel;
    updateValue: (
        property: string | symbol,
        value: UnknownModel,
    ) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}

export const KnownPropertyEditorPart: Component<
    KnownPropertyEditorPartProps
> = ({ id, property, value, updateValue, indent, ownerIdPath }, init) => {
    const idPath = $derived(() => {
        return idPaths.key(ownerIdPath.value, String(property.value));
    });

    const replace = async (value: UnknownModel) => {
        const name = property.peek();
        await updateValue.peek()(name, value);
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
};
