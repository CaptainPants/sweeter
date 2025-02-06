import { type UnknownModel } from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $mutable,
    $peek,
    $val,
    $valProperties,
    Component,
    type ComponentInit,
    LocalizerHook,
} from '@serpentis/ptolemy-core';

import { IconButton } from '../components/IconButton.js';
import { EditorRootContext } from '../context/EditorRootContext.js';
import { ValidationContainerHook } from '../hooks/ValidationContainerHook.js';
import { type EditorProps } from '../types.js';

export const ModalEditor: Component<EditorProps> = (
    {
        next,
        indent: _ignoreIndent,
        model,
        replace,
        propertyDisplayName,
        ...passthrough
    },
    init,
) => {
    const isOpen = $mutable(false);

    const modelSnapshot = $mutable($peek(model));

    const isRoot = passthrough.isRoot;

    // Reset snapshot if incoming version has changed
    init.trackSignals([model], ([model]) => {
        modelSnapshot.value = model;
    });

    const { validated, isValid } = init.hook(ValidationContainerHook);

    const nextProps = $derived(() => {
        return Object.assign({}, $valProperties(passthrough), {
            indent: 0,
            model: modelSnapshot,
            replace: (replacement: UnknownModel): Promise<void> => {
                modelSnapshot.value = replacement;
                return Promise.resolve();
            },
            isRoot: true,
        });
    });

    const onCommit = async (): Promise<void> => {
        if (!isValid.peek()) {
            // TODO: warn user
            return;
        }

        // async
        await $peek(replace)(modelSnapshot.value);

        isOpen.value = false;
    };

    const onCancel = (): void => {
        // Reset value
        modelSnapshot.value = $peek(model);

        isOpen.value = false;
    };

    const { Modal } = init.getContext(EditorRootContext);

    const { localize } = init.hook(LocalizerHook);

    const content = $derived(() => {
        return validated(() => {
            return $val(next)(nextProps.value);
        });
    });

    const title = $derived(
        () =>
            localize('Edit') +
            ' ' +
            ($val(isRoot) ? 'root' : ($val(propertyDisplayName) ?? 'unknown')),
    );

    return $derived(() => {
        return (
            <>
                <IconButton
                    icon="Edit"
                    text={title}
                    onLeftClick={() => {
                        isOpen.value = true;
                    }}
                />
                <Modal
                    key="dialog"
                    isOpen={isOpen}
                    title={propertyDisplayName}
                    commitEnabled={isValid}
                    onCommit={() => void onCommit()}
                    onClose={onCancel}
                >
                    {content}
                </Modal>
            </>
        );
    });
}
