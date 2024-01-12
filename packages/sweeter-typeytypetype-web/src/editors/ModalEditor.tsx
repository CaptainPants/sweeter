import { type Model } from '@captainpants/typeytypetype';

import { type EditorProps } from '../types.js';
import {
    $calc,
    $mutable,
    $peek,
    $val,
    $valObjectValues,
    LocalizerHook,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { EditorRootContext } from '../context/EditorRootContext.js';
import { ValidationContainerHook } from '../hooks/ValidationContainerHook.js';

export function ModalEditor(
    {
        next,
        indent: _ignoreIndent,
        model,
        replace,
        propertyDisplayName,
        ...passthrough
    }: Readonly<EditorProps>,
    init: ComponentInit,
): JSX.Element {
    const isOpen = $mutable(false);

    const modelSnapshot = $mutable($peek(model));

    // Reset snapshot if incoming version has changed
    init.subscribeToChanges([model], ([model]) => {
        modelSnapshot.update(model);
    });

    const { validated, isValid } = init.hook(ValidationContainerHook);

    const nextProps = Object.assign({}, $valObjectValues(passthrough), {
        indent: 0,
        model: modelSnapshot,
        replace: async (replacement: Model<unknown>): Promise<void> => {
            modelSnapshot.update(replacement);
        },
        isRoot: true,
    });

    const onCommit = (): void => {
        if (!isValid.peek()) {
            // TODO: warn user
            return;
        }

        void $peek(replace)(modelSnapshot.value);
    };

    const onCancel = (): void => {
        isOpen.update(false);
    };

    const { EditButton, Modal } = init.getContext(EditorRootContext);

    const { localize } = init.hook(LocalizerHook);

    return $calc(() => (
        <>
            <EditButton
                key="button"
                text={`${localize('Edit')} ${propertyDisplayName ?? 'unknown'}`}
                onClick={() => {
                    isOpen.update(true);
                }}
            />
            <Modal
                key="dialog"
                isOpen={isOpen}
                title={propertyDisplayName}
                commitEnabled={isValid}
                onCommit={onCommit}
                onClose={onCancel}
            >
                {validated(() => $val(next)(nextProps))}
            </Modal>
        </>
    ));
}