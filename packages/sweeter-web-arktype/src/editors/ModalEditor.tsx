import { type UnknownModel } from '@captainpants/sweeter-arktype-modeling';

import { type EditorProps } from '../types.js';
import {
    $derive,
    $mutable,
    $peek,
    $val,
    $valProperties,
    LocalizerHook,
    type ComponentInit,
} from '@captainpants/sweeter-core';
import { EditorRootContext } from '../context/EditorRootContext.js';
import { ValidationContainerHook } from '../hooks/ValidationContainerHook.js';
import { IconButton } from '../components/IconButton.js';

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

    const isRoot = passthrough.isRoot;

    // Reset snapshot if incoming version has changed
    init.trackSignals([model], ([model]) => {
        modelSnapshot.value = model;
    });

    const { validated, isValid } = init.hook(ValidationContainerHook);

    const nextProps = $derive(() => {
        return Object.assign({}, $valProperties(passthrough), {
            indent: 0,
            model: modelSnapshot,
            replace: async (replacement: UnknownModel): Promise<void> => {
                modelSnapshot.value = replacement;
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

    const content = $derive(() => {
        return validated(() => {
            return $val(next)(nextProps.value);
        });
    });

    const title = $derive(
        () =>
            localize('Edit') +
            ' ' +
            ($val(isRoot) ? 'root' : (propertyDisplayName ?? 'unknown')),
    );

    return $derive(() => {
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
                    onCommit={onCommit}
                    onClose={onCancel}
                >
                    {content}
                </Modal>
            </>
        );
    });
}
