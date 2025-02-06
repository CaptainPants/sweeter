import { type UnknownModel } from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $val,
    type Component,
    LocalizerHook,
} from '@serpentis/ptolemy-core';
import { idPaths } from '@serpentis/ptolemy-utilities';

import { EditorHost } from '../components/EditorHost.js';

export interface ElementEditorPartProps {
    index: number;
    elementModel: UnknownModel;
    updateElement: (index: number, value: UnknownModel) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}

export const ElementEditorPart: Component<ElementEditorPartProps> = (
    { index, elementModel, updateElement, indent, ownerIdPath },
    init,
) => {
    const replace = async (value: UnknownModel) => {
        await updateElement.peek()(index.peek(), value);
    };

    const { localize } = init.hook(LocalizerHook);

    return (
        <EditorHost
            model={elementModel}
            replace={replace}
            propertyDisplayName={$derived(() =>
                localize('Element {0}', [$val(index) + 1]),
            )}
            indent={indent}
            idPath={$derived(() =>
                idPaths.index($val(ownerIdPath), $val(index)),
            )}
        />
    );
};
