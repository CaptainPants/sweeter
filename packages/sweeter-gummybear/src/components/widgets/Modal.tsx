import {
    type Component,
    Portal,
    $calc,
    $val,
    type PropertiesMightBeSignals,
    $resolve,
} from '@captainpants/sweeter-core';

export type ModalProps = PropertiesMightBeSignals<{
    title?: JSX.Element | (() => JSX.Element);

    children?: JSX.Element | (() => JSX.Element);

    isOpen?: boolean;

    onClose?: (() => void) | undefined;
}>;

export const Modal: Component<ModalProps> = (
    { title, children, isOpen, onClose },
    init,
) => {
    const container = document.createElement('div');

    init.onMount(() => {
        document.body.appendChild(container);

        return () => {
            container.remove();
        };
    });

    return $calc(() => {
        if (!$val(isOpen)) {
            // Is it OK not to mount(/invoke callback) the children?
            return undefined;
        }

        return (
            <Portal target={container}>
                <div>
                    <div onclick={onClose}>BACKGROUND</div>
                    <div>
                        BOX
                        <div>{$resolve(title)}</div>
                        <div>{$resolve(children)}</div>
                    </div>
                </div>
            </Portal>
        );
    });
};
