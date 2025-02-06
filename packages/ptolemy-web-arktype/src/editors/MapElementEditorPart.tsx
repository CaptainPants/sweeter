import { type UnknownModel } from '@serpentis/ptolemy-arktype-modeling';
import { $derived, Component, LocalizerHook } from '@serpentis/ptolemy-core';
import { idPaths } from '@serpentis/ptolemy-utilities';

import { EditorHost } from '../components/EditorHost.js';

export interface MapElementEditorPartProps {
    id: string;

    property: string | symbol;
    value: UnknownModel;
    updateElement: (
        property: string | symbol,
        value: UnknownModel,
    ) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}

export const MapElementEditorPart: Component<MapElementEditorPartProps> = (
    { property, value, updateElement, indent, ownerIdPath },
    init,
) => {
    const replace = async (value: UnknownModel) => {
        await updateElement.peek()(property.peek(), value);
    };

    const { localize } = init.hook(LocalizerHook);

    const propertyNameAsString = $derived(() => String(property.value));

    return (
        <EditorHost
            model={value}
            replace={replace}
            propertyDisplayName={$derived(() =>
                localize(propertyNameAsString.value),
            )}
            indent={indent}
            idPath={$derived(() =>
                idPaths.key(ownerIdPath.value, propertyNameAsString.value),
            )}
        />
    );
};
