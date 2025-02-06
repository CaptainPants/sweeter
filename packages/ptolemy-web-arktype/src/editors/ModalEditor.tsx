import { type UnknownModel } from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $mutable,
    $wrap,
    Component,
    LocalizerHook,
} from '@serpentis/ptolemy-core';

import { IconButton } from '../components/IconButton.js';
import { EditorRootContext } from '../context/EditorRootContext.js';
import { ValidationContainerHook } from '../hooks/ValidationContainerHook.js';
import { type EditorProps, RenderNextFunctionArgs } from '../types.js';

export const ModalEditor: Component<EditorProps> = (
    {
        next,
        // The indentation for the new modal is set back to zero
        indent: _indentIsReset,
        model,
        replace,
        propertyDisplayName,
        ...passthrough
    },
    init,
) => {
    const isOpen = $mutable(false);

    const modelSnapshot = $mutable(model.peek());

    const isRoot = passthrough.isRoot;

    // Reset snapshot if incoming version has changed
    init.trackSignals([model], ([model]) => {
        modelSnapshot.value = model;
    });

    const { validated, isValid } = init.hook(ValidationContainerHook);

    const nextProps: RenderNextFunctionArgs = Object.assign({}, passthrough, {
        indent: $wrap(0),
        model: modelSnapshot,
        replace: $wrap((replacement: UnknownModel): Promise<void> => {
            modelSnapshot.value = replacement;
            return Promise.resolve();
        }),
        isRoot: true,
    });

    const onCommit = async (): Promise<void> => {
        if (!isValid.peek()) {
            // TODO: warn user
            return;
        }

        // async
        await replace.peek()(modelSnapshot.value);

        isOpen.value = false;
    };

    const onCancel = (): void => {
        // Reset value
        modelSnapshot.value = model.peek();

        isOpen.value = false;
    };

    const { Modal } = init.getContext(EditorRootContext);

    const { localize } = init.hook(LocalizerHook);

    const content = $derived(() => {
        return validated(() => {
            return next.peek()(nextProps);
        });
    });

    const title = $derived(
        () =>
            localize('Edit') +
            ' ' +
            (isRoot?.value ? 'root' : (propertyDisplayName?.value ?? 'unknown')),
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
};
